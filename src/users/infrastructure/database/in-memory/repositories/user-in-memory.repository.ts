import {
  Filter,
  UserRepository,
} from '../../../../../users/domain/repositories/user.repository';
import { UserEntity } from '../../../../../users/domain/entities/user.entity';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { ConflictError } from '../../../../../shared/domain/errors/conflict.error';
import { InMemorySearchableRepository } from '../../../../../shared/domain/repositories/in-memory-searchable.repository';
import { SortDirection } from '../../../../../shared/domain/repositories/searchable.repository.interface';

export class UserInMemoryRepository
  extends InMemorySearchableRepository<UserEntity>
  implements UserRepository
{
  sortableFields: string[] = ['name', 'createdAt'];

  async findByEmail(email: string): Promise<UserEntity> {
    const userEntity = this.items.find((item) => item.email === email);

    if (!userEntity) {
      throw new NotFoundError(`Entity not found using user email:${email}`);
    }
    return userEntity;
  }

  async emailExists(email: string): Promise<void> {
    const userEntity = this.items.find((item) => item.email === email);

    if (userEntity) {
      throw new ConflictError(`Email already exists!`);
    }
  }

  protected async applyFilter(
    items: UserEntity[],
    filter: Filter,
  ): Promise<UserEntity[]> {
    if (!filter) {
      return items;
    }
    return items.filter((item) =>
      item.props.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  protected async applySort(
    items: UserEntity[],
    sort: string | null,
    sortDir?: SortDirection | null,
  ): Promise<UserEntity[]> {
    return !sort
      ? super.applySort(items, 'createdAt', sortDir)
      : super.applySort(items, sort, sortDir);
  }
}
