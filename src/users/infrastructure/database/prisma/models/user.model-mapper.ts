import { User } from '@prisma/client';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { ValidationError } from '../../../../../shared/domain/errors/validation.error';

export class UserModelMapper {
  static toEntity(model: User): UserEntity {
    const data = {
      name: model.name,
      password: model.password,
      email: model.email,
      createdAt: model.createdAt,
    };

    try {
      return new UserEntity(data, model.id);
    } catch {
      throw new ValidationError('An entity not be loaded');
    }
  }
}
