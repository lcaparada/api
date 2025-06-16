import { UserEntity } from '../../../users/domain/entities/user.entity';

export interface UserOutputDto {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  password: string;
}

export class UserOutputMapper {
  static toOutput(entity: UserEntity): UserOutputDto {
    return entity.toJSON();
  }
}
