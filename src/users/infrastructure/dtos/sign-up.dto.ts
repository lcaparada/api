import { SignUpUseCaseInput } from '../../application/useCases/sign-up.use-case';

export class SignUpDto implements SignUpUseCaseInput {
  name: string;
  email: string;
  password: string;
}
