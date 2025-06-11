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
});
