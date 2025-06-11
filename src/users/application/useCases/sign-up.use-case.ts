export type SignUpUseCaseInput = {
  name: string;
  password: string;
  email: string;
};

export type SignUpUseCasOutput = {
  id: string;
  name: string;
  password: string;
  email: string;
  createdAt: Date;
};

export class SignUpUseCase {
  async execute(input: SignUpUseCaseInput): Promise<SignUpUseCasOutput> {}
}
