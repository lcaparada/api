import { SearchResult } from '../../../../domain/repositories/user.repository';
import { UserInMemoryRepository } from '../../../../../users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { ListUsersUseCase } from '../../list-users.use-case';
import { userDataBuilder } from '../../../../../users/domain/testing/helpers/user-data-builder';
import { UserEntity } from '../../../../../users/domain/entities/user.entity';

describe('ListUsersUseCase unit case', () => {
  let repository: UserInMemoryRepository;
  let sut: ListUsersUseCase;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new ListUsersUseCase(repository);
  });

  it('should return items in toOutput method', async () => {
    const item = new UserEntity(userDataBuilder({}));
    const searchResult = new SearchResult({
      currentPage: 1,
      filter: null,
      items: [item],
      perPage: 1,
      sort: null,
      sortDir: null,
      total: 1,
    });

    const result = sut['toOutput'](searchResult);
    expect(result).toStrictEqual({
      items: [item.toJSON()],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
    });
  });

  it('should return the users ordered by createdAt', async () => {
    const createdAt = new Date();
    const searchSpyOn = jest.spyOn(repository, 'search');
    const items = [
      new UserEntity(userDataBuilder({ createdAt: createdAt })),
      new UserEntity(
        userDataBuilder({ createdAt: new Date(createdAt.getTime() + 1) }),
      ),
    ];
    repository.items = items;
    const result = await sut.execute({});
    expect(searchSpyOn).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual({
      items: [items[1].toJSON(), items[0].toJSON()],
      total: 2,
      currentPage: 1,
      lastPage: 1,
      perPage: 15,
    });
  });

  it('should return the users using pagination,sort and filter', async () => {
    const searchSpyOn = jest.spyOn(repository, 'search');
    const items = [
      new UserEntity(userDataBuilder({ name: 'a' })),
      new UserEntity(userDataBuilder({ name: 'Aa' })),
      new UserEntity(userDataBuilder({ name: 'AA' })),
      new UserEntity(userDataBuilder({ name: 'b' })),
      new UserEntity(userDataBuilder({ name: 'C' })),
    ];
    repository.items = items;
    let result = await sut.execute({
      filter: 'a',
      sort: 'name',
      sortDir: 'asc',
      perPage: 2,
      page: 1,
    });

    expect(result).toStrictEqual({
      items: [items[2].toJSON(), items[1].toJSON()],
      total: 3,
      currentPage: 1,
      lastPage: 2,
      perPage: 2,
    });
    expect(searchSpyOn).toHaveBeenCalledTimes(1);

    result = await sut.execute({
      filter: 'a',
      sort: 'name',
      sortDir: 'asc',
      perPage: 2,
      page: 2,
    });

    expect(result).toStrictEqual({
      items: [items[0].toJSON()],
      total: 3,
      currentPage: 2,
      lastPage: 2,
      perPage: 2,
    });
    expect(searchSpyOn).toHaveBeenCalledTimes(2);
  });
});
