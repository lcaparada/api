import { UseCase } from '../../../shared/application/useCases/use-case';
import { UserRepository } from '../../domain/repositories/user.repository';

export type DeleteUserUseCaseInput = {
  id: string;
};

export type DeleteUserUseCaseOutput = void;

export class DeleteUserUseCase
  implements UseCase<DeleteUserUseCaseInput, DeleteUserUseCaseOutput>
{
  constructor(private userRepository: UserRepository) {}

  async execute(
    input: DeleteUserUseCaseInput,
  ): Promise<DeleteUserUseCaseOutput> {
    await this.userRepository.delete(input.id);
  }
}
