import { UserInMemoryRepository } from '../../../../../users/infrastructure/database/in-memory/repositories/user-in-memory.repository';

import { userDataBuilder } from '../../../../../users/domain/testing/helpers/user-data-builder';

import { GetUserUseCase } from '../../get-user.use-case';
import { UserEntity } from '../../../../../users/domain/entities/user.entity';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';

describe('GetUserUseCase unit test', () => {
  let sut: GetUserUseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new GetUserUseCase(repository);
  });

  it('should throws an error when user is not found', async () => {
    await expect(sut.execute({ id: '123' })).rejects.toThrow(
      new NotFoundError('Entity not found'),
    );
  });

  it('should return user by id', async () => {
    const entity = new UserEntity({ ...userDataBuilder({}) }, '123');
    await repository.insert(entity);
    const foundedEntity = await sut.execute({ id: '123' });
    expect(foundedEntity).toStrictEqual(entity.toJSON());
  });
});
