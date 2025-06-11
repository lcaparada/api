import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { BadRequestError } from '../errors/bad-request.error';

export type SignUpUseCaseInput = {
  name: string;
  email: string;
  password: string;
};

export type SignUpUseCaseOutput = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
};

export class SignUpUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(input: SignUpUseCaseInput): Promise<SignUpUseCaseOutput> {
    const { email, name, password } = input;
    if (!email || !name || !password) {
      throw new BadRequestError('Input data does not provider');
    }
    await this.userRepository.emailExists(email);
    const entity = new UserEntity(input);
    await this.userRepository.insert(entity);
    return entity.toJSON();
  }
}
