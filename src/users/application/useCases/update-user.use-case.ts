import { BadRequestError } from '../../../shared/application/errors/bad-request.error';
import { UseCase } from '../../../shared/application/useCases/use-case';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserOutputDto, UserOutputMapper } from '../dtos/user-output.dto';

export type UpdateUserUseCaseInput = {
  id: string;
  name: string;
};

export type UpdateUserUseCaseOutput = UserOutputDto;

export class UpdateUserUseCase
  implements UseCase<UpdateUserUseCaseInput, UpdateUserUseCaseOutput>
{
  constructor(private userRepository: UserRepository) {}

  async execute(
    input: UpdateUserUseCaseInput,
  ): Promise<UpdateUserUseCaseOutput> {
    if (!input.name) {
      throw new BadRequestError('Name was not provide.');
    }
    const entity = await this.userRepository.findById(input.id);
    entity.updateName(input.name);
    await this.userRepository.update(entity);
    return UserOutputMapper.toOutput(entity);
  }
}
