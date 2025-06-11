import { UserRepository } from '../../domain/repositories/user.repository';

export type GetUserUseCaseInput = {
  id: string;
};

export type GetUserUseCaseOutput = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

export class GetUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(input: GetUserUseCaseInput): Promise<GetUserUseCaseOutput> {
    const entity = await this.userRepository.findById(input.id);
    return entity.toJSON();
  }
}
