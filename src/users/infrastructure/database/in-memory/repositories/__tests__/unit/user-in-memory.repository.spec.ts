import { userDataBuilder } from '../../../../../../../users/domain/testing/helpers/user-data-builder';
import { UserEntity } from '../../../../../../../users/domain/entities/user.entity';
import { UserInMemoryRepository } from '../../user-in-memory.repository';
import { NotFoundError } from '../../../../../../../shared/domain/errors/not-found.error';
import { ConflictError } from '../../../../../../../shared/domain/errors/conflict.error';

describe('UserInMemoryRepository unit tests', () => {
  let sut: UserInMemoryRepository;
  beforeEach(() => {
    sut = new UserInMemoryRepository();
  });

  describe('FindByEmail method', () => {
    it('should throw error when not found a email', async () => {
      await expect(sut.findByEmail('example@example.com')).rejects.toThrow(
        new NotFoundError(
          `Entity not found using user email:example@example.com`,
        ),
      );
    });

    it('should find a entity by email', async () => {
      const entity = new UserEntity({ ...userDataBuilder({}) });
      await sut.insert(entity);
      const foundedEntity = await sut.findByEmail(entity.email);
      expect(foundedEntity.toJSON()).toStrictEqual(entity.toJSON());
    });
  });

  describe('EmailExists method', () => {
    it('should throw error when email already exists', async () => {
      const entity = new UserEntity({ ...userDataBuilder({}) });
      await sut.insert(entity);
      await expect(sut.emailExists(entity.email)).rejects.toThrow(
        new ConflictError('Email already exists!'),
      );
    });

    it(`should not throw error when email doesn't exists`, async () => {
      expect.assertions(0);
      await sut.emailExists('example@example.com');
    });
  });

  describe('ApplyFilter method', () => {
    it('should return all items when filter param is null', async () => {
      const items = [
        new UserEntity({ ...userDataBuilder({}) }),
        new UserEntity({ ...userDataBuilder({}) }),
        new UserEntity({ ...userDataBuilder({}) }),
      ];

      const result = await sut['applyFilter'](items, null);
      const spyFilter = jest.spyOn(result, 'filter');

      expect(result).toStrictEqual(items);
      expect(spyFilter).not.toHaveBeenCalled();
    });

    it('should return filtered items', async () => {
      const items = [
        new UserEntity({ ...userDataBuilder({ name: 'test' }) }),
        new UserEntity({ ...userDataBuilder({ name: 'TEST' }) }),
        new UserEntity({ ...userDataBuilder({ name: 'fake' }) }),
      ];

      const spyFilter = jest.spyOn(items, 'filter');
      const result = await sut['applyFilter'](items, 'test');

      expect(result).toStrictEqual([items[0], items[1]]);
      expect(spyFilter).toHaveBeenCalledTimes(1);
    });
  });

  describe('ApplySort method', () => {
    it('should return all items when filter parameter is null', async () => {
      const items = [
        new UserEntity({ ...userDataBuilder({}) }),
        new UserEntity({ ...userDataBuilder({}) }),
        new UserEntity({ ...userDataBuilder({}) }),
      ];

      const result = await sut['applyFilter'](items, null);
      const spyFilter = jest.spyOn(result, 'filter');

      expect(result).toStrictEqual(items);
      expect(spyFilter).not.toHaveBeenCalled();
    });

    it('should sort by createdAt when sort param is null', async () => {
      const createdAt = new Date();
      const items = [
        new UserEntity({ ...userDataBuilder({ name: 'test', createdAt }) }),
        new UserEntity({
          ...userDataBuilder({
            name: 'TEST',
            createdAt: new Date(createdAt.getTime() + 1),
          }),
        }),
        new UserEntity({
          ...userDataBuilder({
            name: 'TeSt',
            createdAt: new Date(createdAt.getTime() + 2),
          }),
        }),
      ];

      const sortedItems = await sut['applySort'](items, null, null);

      expect(sortedItems).toStrictEqual([items[2], items[1], items[0]]);
    });

    it('should sort by name field', async () => {
      const items = [
        new UserEntity({ ...userDataBuilder({ name: 'test' }) }),
        new UserEntity({
          ...userDataBuilder({
            name: 'TEST',
          }),
        }),
        new UserEntity({
          ...userDataBuilder({
            name: 'TeSt',
          }),
        }),
      ];

      let sortedItems = await sut['applySort'](items, 'name', 'asc');

      expect(sortedItems).toStrictEqual([items[1], items[2], items[0]]);

      sortedItems = await sut['applySort'](items, 'name', null);

      expect(sortedItems).toStrictEqual([items[0], items[2], items[1]]);
    });
  });
});
