import { UseCase } from '../../../shared/application/useCases/use-case';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserOutputDto, UserOutputMapper } from '../dtos/user-output.dto';

export type GetUserUseCaseInput = {
  id: string;
};

export type GetUserUseCaseOutput = UserOutputDto;

export class GetUserUseCase
  implements UseCase<GetUserUseCaseInput, GetUserUseCaseOutput>
{
  constructor(private userRepository: UserRepository) {}

  async execute(input: GetUserUseCaseInput): Promise<GetUserUseCaseOutput> {
    const entity = await this.userRepository.findById(input.id);
    return UserOutputMapper.toOutput(entity);
  }
}
