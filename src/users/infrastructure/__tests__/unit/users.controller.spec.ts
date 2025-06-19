import { UsersController } from '../../users.controller';
import { UserOutputDto } from '../../../application/dtos/user-output.dto';
import { SignUpUseCaseOutput } from '../../../application/useCases/sign-up.use-case';
import { SignUpDto } from '../../dtos/sign-up.dto';
import { SignInUseCaseOutput } from '../../../application/useCases/sign-in.use-case';
import { SignInDto } from '../../dtos/sign-in.dto';
import { UpdateUserUseCaseOutput } from '../../../application/useCases/update-user.use-case';
import { UpdateUserDto } from '../../dtos/update-user.dto';

describe('UsersController', () => {
  let sut: UsersController;
  let id: string;
  let props: UserOutputDto;

  beforeEach(async () => {
    sut = new UsersController();
    id = 'faf9a9e9-914f-4658-987b-3c7cdfa3fadc';
    props = {
      id,
      name: 'John Doe',
      email: 'a@a.com',
      password: '123',
      createdAt: new Date(),
    };
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should create a user', async () => {
    const output: SignUpUseCaseOutput = props;
    const mockSignUpUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['signUpUseCase'] = mockSignUpUseCase as any;
    const input: SignUpDto = {
      name: 'John Doe',
      email: 'a@a.com',
      password: '123',
    };

    const result = await sut.create(input);
    expect(output).toMatchObject(result);
    expect(mockSignUpUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('should login an user', async () => {
    const output: SignInUseCaseOutput = props;
    const mockSignInUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['signInUseCase'] = mockSignInUseCase as any;
    const input: SignInDto = {
      email: 'a@a.com',
      password: '123',
    };

    const result = await sut.login(input);
    expect(output).toMatchObject(result);
    expect(mockSignInUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('should update an user', async () => {
    const output: UpdateUserUseCaseOutput = props;
    const mockUpdateUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['updateUserUseCase'] = mockUpdateUserUseCase as any;
    const input: UpdateUserDto = {
      name: 'fake',
    };

    const result = await sut.update(id, input);
    expect(output).toMatchObject(result);
    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    });
  });
});
