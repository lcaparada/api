import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTests } from '../../../../../shared/infrastructure/database/prisma/testing/setup.prisma.testing';
import { UserPrismaRepository } from '../../../../infrastructure/database/prisma/repositories/user.prisma.repository';
import { DatabaseModule } from '../../../../../shared/infrastructure/database/database.module';
import { DeleteUserUseCase } from '../../delete-user.use-case';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { userDataBuilder } from '../../../../domain/testing/helpers/user-data-builder';

describe('SignUpUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: DeleteUserUseCase;
  let module: TestingModule;
  let repository: UserPrismaRepository;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
    repository = new UserPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new DeleteUserUseCase(repository);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
    await prismaService.$disconnect();
  });

  it('should throw error when entity not found', async () => {
    await expect(sut.execute({ id: 'fakeId' })).rejects.toThrow(
      new NotFoundError(`UserModel not found using ID : fakeId`),
    );
  });

  it('should delete an user', async () => {
    const entity = new UserEntity(userDataBuilder({}));
    await prismaService.user.create({ data: entity.toJSON() });

    await sut.execute({ id: entity.id });
    const output = await prismaService.user.findUnique({
      where: {
        id: entity.id,
      },
    });
    const models = await prismaService.user.findMany();

    expect(output).toBeNull();
    expect(models).toHaveLength(0);
  });
});
