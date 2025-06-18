import { UserInMemoryRepository } from '../../../../../users/infrastructure/database/in-memory/repositories/user-in-memory.repository';

import { userDataBuilder } from '../../../../../users/domain/testing/helpers/user-data-builder';

import { UserEntity } from '../../../../../users/domain/entities/user.entity';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { DeleteUserUseCase } from '../../delete-user.use-case';

describe('DeleteUserUseCase unit test', () => {
  let sut: DeleteUserUseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new DeleteUserUseCase(repository);
  });

  it('should throws an error when user is not found', async () => {
    await expect(sut.execute({ id: '123' })).rejects.toThrow(
      new NotFoundError('Entity not found'),
    );
  });

  it('should delete user by id', async () => {
    const spyDelete = jest.spyOn(repository, 'delete');
    const entity = new UserEntity(userDataBuilder({}));
    repository.items = [entity];

    expect(repository.items).toHaveLength(1);
    await sut.execute({ id: entity.id });
    expect(repository.items).toHaveLength(0);
    expect(spyDelete).toHaveBeenCalledTimes(1);
  });
});
