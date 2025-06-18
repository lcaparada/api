import { BCryptjsHashProvider } from '../../../users/infrastructure/providers/hashProvider/bcryptjs.hash-provider';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserOutputDto, UserOutputMapper } from '../dtos/user-output.dto';
import { BadRequestError } from '../../../shared/application/errors/bad-request.error';
import { UseCase } from '../../../shared/application/useCases/use-case';
import { InvalidCredentialsError } from '../../../shared/application/errors/invalid-credentials.error';

export type SignInUseCaseInput = {
  email: string;
  password: string;
};

export type SignInUseCaseOutput = UserOutputDto;

export class SignInUseCase
  implements UseCase<SignInUseCaseInput, SignInUseCaseOutput>
{
  constructor(
    private userRepository: UserRepository,
    private hashProvider: BCryptjsHashProvider,
  ) {}

  async execute(input: SignInUseCaseInput): Promise<UserOutputDto> {
    if (!input.email || !input.password) {
      throw new BadRequestError('Email and password is required.');
    }
    const entity = await this.userRepository.findByEmail(input.email);
    const passwordMatches = this.hashProvider.compareHash(
      input.password,
      entity.password,
    );

    if (!passwordMatches) {
      throw new InvalidCredentialsError('Invalid credentials.');
    }
    return UserOutputMapper.toOutput(entity);
  }
}
