import { UserRepository } from '../../../../../users/domain/repositories/user.repository';
import { UserEntity } from '../../../../../users/domain/entities/user.entity';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { ConflictError } from '../../../../../shared/domain/errors/conflict.error';
import { InMemorySearchableRepository } from '../../../../../shared/domain/repositories/in-memory-searchable.repository';

export class UserInMemoryRepository
  extends InMemorySearchableRepository<UserEntity>
  implements UserRepository
{
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
}
