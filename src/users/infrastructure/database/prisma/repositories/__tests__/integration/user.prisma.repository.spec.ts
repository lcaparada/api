import { PrismaClient } from '@prisma/client';
import { UserPrismaRepository } from '../../user.prisma.repository';
import { setupPrismaTests } from '../../../../../../../shared/infrastructure/database/prisma/testing/setup.prisma.testing';
import { NotFoundError } from '../../../../../../../shared/domain/errors/not-found.error';
import { UserEntity } from '../../../../../../domain/entities/user.entity';
import { userDataBuilder } from '../../../../../../domain/testing/helpers/user-data-builder';
import {
  SearchParams,
  SearchResult,
} from '../../../../../../domain/repositories/user.repository';
import { ConflictError } from '../../../../../../../shared/domain/errors/conflict.error';

describe('UserPrismaRepository integration test', () => {
  const prismaService = new PrismaClient();
  let sut: UserPrismaRepository;

  beforeAll(async () => {
    setupPrismaTests();
  });

  beforeEach(async () => {
    sut = new UserPrismaRepository(prismaService as any);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  describe('FindById method', () => {
    it('should throws error when entity not found', async () => {
      await expect(() => sut.findById('123')).rejects.toThrow(
        new NotFoundError(`UserModel not found using ID : 123`),
      );
    });

    it('should find an entity by id', async () => {
      const entity = new UserEntity(userDataBuilder({}));
      const newUser = await prismaService.user.create({
        data: entity.toJSON(),
      });

      const foundedUser = await sut.findById(newUser.id);

      expect(foundedUser.toJSON()).toStrictEqual(newUser);
    });
  });

  describe('EmailExists method', () => {
    it('should returns error if email already exists', async () => {
      const entity = new UserEntity(userDataBuilder({}));
      await prismaService.user.create({
        data: entity.toJSON(),
      });

      await expect(sut.emailExists(entity.email)).rejects.toThrow(
        new ConflictError(`Email already exists`),
      );
    });

    it('should not return error if email does not exist', async () => {
      const entity = new UserEntity(userDataBuilder({}));
      const output = await sut.emailExists(entity.email);
      expect(output).toBeUndefined();
    });
  });

  describe('Insert method', () => {
    it('should insert an new entity', async () => {
      const entity = new UserEntity(userDataBuilder({}));
      await sut.insert(entity);

      const foundedUser = await prismaService.user.findUnique({
        where: { id: entity.id },
      });

      expect(foundedUser).toStrictEqual(entity.toJSON());
    });
  });

  describe('FindAll method', () => {
    it('should get all users', async () => {
      const entity = new UserEntity(userDataBuilder({}));
      await prismaService.user.create({ data: entity.toJSON() });
      const entities = await sut.findAll();
      expect(entities).toHaveLength(1);
      entities.map((item) =>
        expect(item.toJSON()).toStrictEqual(entity.toJSON()),
      );
    });
  });

  describe('FindByEmail method', () => {
    it('should throws error when an entity not found', async () => {
      const entity = new UserEntity(userDataBuilder({}));
      await expect(() => sut.findByEmail(entity.email)).rejects.toThrow(
        new NotFoundError(`UserModel not found using email : ${entity.email}`),
      );
    });

    it('should finds an entity by email', async () => {
      const entity = new UserEntity(userDataBuilder({}));
      await prismaService.user.create({
        data: entity.toJSON(),
      });
      const foundedEntity = await sut.findByEmail(entity.email);
      expect(foundedEntity.toJSON()).toStrictEqual(entity.toJSON());
    });
  });

  describe('Delete method', () => {
    it('should throws error when entity not found', async () => {
      const entity = new UserEntity(userDataBuilder({}));
      await expect(() => sut.delete(entity.id)).rejects.toThrow(
        new NotFoundError(`UserModel not found using ID : ${entity.id}`),
      );
    });

    it('should delete an entity', async () => {
      const entity = new UserEntity(userDataBuilder({}));
      await prismaService.user.create({
        data: entity.toJSON(),
      });
      await sut.delete(entity.id);

      const users = await prismaService.user.findMany();

      expect(users).toHaveLength(0);
    });
  });

  describe('Update method', () => {
    it('should throws error when entity not found', async () => {
      const entity = new UserEntity(userDataBuilder({}));
      await expect(() => sut.update(entity)).rejects.toThrow(
        new NotFoundError(`UserModel not found using ID : ${entity.id}`),
      );
    });

    it('should update an entity', async () => {
      const entity = new UserEntity(userDataBuilder({}));
      await prismaService.user.create({
        data: entity.toJSON(),
      });
      entity.updateName('new name');
      await sut.update(entity);

      const updatedUser = await prismaService.user.findUnique({
        where: { id: entity.id },
      });

      expect(updatedUser.name).toStrictEqual(entity.name);
    });
  });

  describe('Search method', () => {
    it('should apply pagination when the other params are null', async () => {
      const createdAt = new Date();
      const entities: UserEntity[] = [];
      const arrange = Array(16).fill(userDataBuilder({}));
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

      const searchOutput = await sut.search(new SearchParams({}));
      const items = searchOutput.items;

      expect(searchOutput).toBeInstanceOf(SearchResult);
      expect(searchOutput.total).toBe(16);
      expect(searchOutput.items.length).toBe(15);
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(UserEntity);
      });
      items
        .reverse()
        .forEach((item, index) =>
          expect(`test${index + 1}@mail.com`).toBe(item.email),
        );
    });

    it('should search using filter, sort and pagination', async () => {
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

      const searchOutputPageOne = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      );

      expect(searchOutputPageOne.items[0].toJSON()).toMatchObject(
        entities[0].toJSON(),
      );
      expect(searchOutputPageOne.items[1].toJSON()).toMatchObject(
        entities[4].toJSON(),
      );

      const searchOutputPageTwo = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      );

      expect(searchOutputPageTwo.items[0].toJSON()).toMatchObject(
        entities[2].toJSON(),
      );
    });
  });
});
