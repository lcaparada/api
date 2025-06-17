import { InvalidPasswordError } from '../../../shared/application/errors/invalid-password.error';
import { UseCase } from '../../../shared/application/useCases/use-case';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserOutputDto, UserOutputMapper } from '../dtos/user-output.dto';
import { BCryptjsHashProvider } from '../../../users/infrastructure/providers/hashProvider/bcryptjs.hash-provider';

export type UpdatePasswordUseCaseInput = {
  id: string;
  oldPassword: string;
  newPassword: string;
};

export type UpdatePasswordUseCaseOutput = UserOutputDto;

export class UpdateUserUseCase
  implements UseCase<UpdatePasswordUseCaseInput, UpdatePasswordUseCaseOutput>
{
  constructor(
    private userRepository: UserRepository,
    private hashProvider: BCryptjsHashProvider,
  ) {}

  async execute(
    input: UpdatePasswordUseCaseInput,
  ): Promise<UpdatePasswordUseCaseOutput> {
    const entity = await this.userRepository.findById(input.id);
    if (!input.oldPassword || !input.newPassword) {
      throw new InvalidPasswordError(
        'Old password and new password is required.',
      );
    }
    const checkOldPassword = await this.hashProvider.compareHash(
      input.oldPassword,
      entity.password,
    );
    if (!checkOldPassword) {
      throw new InvalidPasswordError(
        'Old password is not equal to current password.',
      );
    }
    const newPassword = await this.hashProvider.generateHash(input.newPassword);
    entity.updatePassword(newPassword);
    await this.userRepository.update(entity);
    return UserOutputMapper.toOutput(entity);
  }
}
