import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTests } from '../../../../../shared/infrastructure/database/prisma/testing/setup.prisma.testing';
import { UserPrismaRepository } from '../../../../infrastructure/database/prisma/repositories/user.prisma.repository';
import { DatabaseModule } from '../../../../../shared/infrastructure/database/database.module';
import { HashProvider } from '../../../../../shared/application/providers/hash.provider';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { BCryptjsHashProvider } from '../../../../infrastructure/providers/hashProvider/bcryptjs.hash-provider';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { userDataBuilder } from '../../../../domain/testing/helpers/user-data-builder';
import { SignInUseCase } from '../../sign-in.use-case';
import { BadRequestError } from '../../../../../shared/application/errors/bad-request.error';
import { InvalidCredentialsError } from '../../../../../shared/application/errors/invalid-credentials.error';

describe('SignUpUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: SignInUseCase;
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
    sut = new SignInUseCase(repository, hashProvider);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
    await prismaService.$disconnect();
  });

  it('should throws an error when email or password are not provide', async () => {
    await expect(sut.execute({ email: '', password: '' })).rejects.toThrow(
      new BadRequestError('Email and password is required.'),
    );
  });

  it('should throws an error when email does not exist', async () => {
    await expect(
      sut.execute({ email: 'a@a.com', password: '123' }),
    ).rejects.toThrow(
      new NotFoundError(`UserModel not found using email : a@a.com`),
    );
  });

  it('should throws an error when password provide is not equal to current password', async () => {
    const encryptedPassword = await hashProvider.generateHash('fakePassword');
    const entity = new UserEntity(
      userDataBuilder({ email: 'a@a.com', password: encryptedPassword }),
    );
    await prismaService.user.create({ data: entity.toJSON() });
    await expect(
      sut.execute({ email: 'a@a.com', password: '123' }),
    ).rejects.toThrow(new InvalidCredentialsError('Invalid credentials.'));
  });

  it('should sign in user', async () => {
    const encryptedPassword = await hashProvider.generateHash('fakePassword');
    const entity = new UserEntity(
      userDataBuilder({ email: 'a@a.com', password: encryptedPassword }),
    );
    await prismaService.user.create({ data: entity.toJSON() });
    const output = await sut.execute({
      email: 'a@a.com',
      password: 'fakePassword',
    });
    expect(output).toStrictEqual(entity.toJSON());
  });
});
