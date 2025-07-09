import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTests } from '../../../../../shared/infrastructure/database/prisma/testing/setup.prisma.testing';
import { UserPrismaRepository } from '../../../../infrastructure/database/prisma/repositories/user.prisma.repository';
import { DatabaseModule } from '../../../../../shared/infrastructure/database/database.module';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { userDataBuilder } from '../../../../domain/testing/helpers/user-data-builder';
import { ListUsersUseCase } from '../../list-users.use-case';

describe('SignUpUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: ListUsersUseCase;
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
    sut = new ListUsersUseCase(repository);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
    await prismaService.$disconnect();
  });

  it('should returns users ordered by created at', async () => {
    const createdAt = new Date();
    const entities: UserEntity[] = [];
    const arrange = Array(3).fill(userDataBuilder({}));
    arrange.forEach((element, index) => {
      entities.push(
        new UserEntity({
          ...element,
          email: `test${index}@mail.com`,
          createdAt: new Date(createdAt.getTime() + index),
        }),
      );
    });

    await prismaService.user.createMany({
      data: entities.map((entity) => entity.toJSON()),
    });

    const output = await sut.execute({});

    expect(output).toStrictEqual({
      items: entities.reverse().map((entity) => entity.toJSON()),
      total: 3,
      perPage: 15,
      currentPage: 1,
      lastPage: 1,
    });
  });

  it('should returns output using filter, sort and pagination', async () => {
    const createdAt = new Date();
    const entities: UserEntity[] = [];
    const arrange = ['test', 'a', 'TEST', 'b', 'TeSt'];
    arrange.forEach((element, index) => {
      entities.push(
        new UserEntity({
          ...userDataBuilder({ name: element }),
          createdAt: new Date(createdAt.getTime() + index),
        }),
      );
    });

    await prismaService.user.createMany({
      data: entities.map((entity) => entity.toJSON()),
    });

    let output = await sut.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'TEST',
    });

    expect(output).toMatchObject({
      items: [entities[0].toJSON(), entities[4].toJSON()],
      total: 3,
      perPage: 2,
      currentPage: 1,
      lastPage: 2,
    });

    output = await sut.execute({
      page: 2,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'TEST',
    });

    expect(output).toMatchObject({
      items: [entities[2].toJSON()],
      total: 3,
      perPage: 2,
      currentPage: 2,
      lastPage: 2,
    });
  });
});
