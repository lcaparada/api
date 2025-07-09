import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTests } from '../../../../../shared/infrastructure/database/prisma/testing/setup.prisma.testing';
import { UserPrismaRepository } from '../../../../infrastructure/database/prisma/repositories/user.prisma.repository';
import { DatabaseModule } from '../../../../../shared/infrastructure/database/database.module';
import { HashProvider } from '../../../../../shared/application/providers/hash.provider';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { BCryptjsHashProvider } from '../../../../infrastructure/providers/hashProvider/bcryptjs.hash-provider';
import { UpdatePasswordUseCase } from '../../update-password.use-case';
import { InvalidPasswordError } from '../../../../../shared/application/errors/invalid-password.error';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { userDataBuilder } from '../../../../domain/testing/helpers/user-data-builder';

describe('SignUpUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: UpdatePasswordUseCase;
  let module: TestingModule;
  let repository: UserPrismaRepository;
  let hashProvider: HashProvider;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
    repository = new UserPrismaRepository(prismaService as any);
    hashProvider = new BCryptjsHashProvider();
  });

  beforeEach(async () => {
    sut = new UpdatePasswordUseCase(repository, hashProvider);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
    await prismaService.$disconnect();
  });

  it('should throws an error when user does not exist', async () => {
    await expect(
      sut.execute({ id: 'fakeId', newPassword: '', oldPassword: '' }),
    ).rejects.toThrow(
      new NotFoundError('UserModel not found using ID : fakeId'),
    );
  });

  it('should throws an error when old password and new password are not provide', async () => {
    const entity = new UserEntity(userDataBuilder({}));
    await prismaService.user.create({ data: entity.toJSON() });
    await expect(
      sut.execute({ id: entity.id, newPassword: '', oldPassword: '' }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password is required.'),
    );
  });

  it('should throws an error when old password is incorrect', async () => {
    const entity = new UserEntity(
      userDataBuilder({ password: 'fakePassword' }),
    );
    await prismaService.user.create({ data: entity.toJSON() });
    await expect(
      sut.execute({
        id: entity.id,
        newPassword: 'newPassword',
        oldPassword: '123',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError(
        'Old password is not equal to current password.',
      ),
    );
  });

  it('should update password', async () => {
    const encryptedPassword = await hashProvider.generateHash('fakePassword');
    const entity = new UserEntity(
      userDataBuilder({ password: encryptedPassword }),
    );
    await prismaService.user.create({ data: entity.toJSON() });
    const output = await sut.execute({
      id: entity.id,
      newPassword: 'newPassword',
      oldPassword: 'fakePassword',
    });

    console.log(output);
    const checkNewPassword = await hashProvider.compareHash(
      'newPassword',
      output.password,
    );

    expect(checkNewPassword).toBeTruthy();
  });
});
