import { UserInMemoryRepository } from '../../../../../users/infrastructure/database/in-memory/repositories/user-in-memory.repository';

import { UpdateUserUseCase } from '../../update-user.use-case';
import { BadRequestError } from '../../../../../shared/application/errors/bad-request.error';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { userDataBuilder } from '../../../../domain/testing/helpers/user-data-builder';

describe('UpdateUserUseCase unit test', () => {
  let sut: UpdateUserUseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new UpdateUserUseCase(repository);
  });

  it('should throws an error when name is not provide', async () => {
    await expect(sut.execute({ id: '123', name: '' })).rejects.toThrow(
      new BadRequestError('Name was not provide.'),
    );
  });

  it('should throws an error when entity is not found', async () => {
    await expect(sut.execute({ id: '123', name: 'test' })).rejects.toThrow(
      new NotFoundError('Entity not found'),
    );
  });

  it('should return entity with update data', async () => {
    const userProps = userDataBuilder({});
    const entity = new UserEntity(userProps, '1');
    const spyUpdate = jest.spyOn(repository, 'update');

    await repository.insert(entity);

    const result = await sut.execute({ id: '1', name: 'test' });

    expect(result).toStrictEqual({ id: '1', name: 'test', ...userProps });
    expect(spyUpdate).toHaveBeenCalledTimes(1);
  });
});
