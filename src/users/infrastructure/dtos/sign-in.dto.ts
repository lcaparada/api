import { SignInUseCaseInput } from '../../application/useCases/sign-in.use-case';

export class SignInDto implements SignInUseCaseInput {
  email: string;
  password: string;
}
