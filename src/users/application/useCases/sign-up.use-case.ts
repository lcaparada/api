import { BCryptjsHashProvider } from '../../../users/infrastructure/providers/hashProvider/bcryptjs.hash-provider';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserOutputDto } from '../dtos/user-output.dto';
import { BadRequestError } from '../errors/bad-request.error';
import { UseCase } from '../../../shared/application/useCases/use-case';

export type SignUpUseCaseInput = {
  name: string;
  email: string;
  password: string;
};

export type SignUpUseCaseOutput = UserOutputDto;

export class SignUpUseCase
  implements UseCase<SignUpUseCaseInput, SignUpUseCaseOutput>
{
  constructor(
    private userRepository: UserRepository,
    private hashProvider: BCryptjsHashProvider,
  ) {}

  async execute(input: SignUpUseCaseInput): Promise<SignUpUseCaseOutput> {
    if (!input) {
      throw new BadRequestError('Input data does not provider');
    }
    if (!input.email || !input.name || !input.password) {
      throw new BadRequestError('Input data does not provider');
    }
    await this.userRepository.emailExists(input.email);
    const encryptedPassword = await this.hashProvider.generateHash(
      input.password,
    );
    const entity = new UserEntity({ ...input, password: encryptedPassword });
    await this.userRepository.insert(entity);
    return entity.toJSON();
  }
}
