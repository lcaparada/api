import { UsersController } from '../../users.controller';
import { UserOutputDto } from '../../../application/dtos/user-output.dto';
import { SignUpUseCaseOutput } from '../../../application/useCases/sign-up.use-case';
import { SignUpDto } from '../../dtos/sign-up.dto';
import { SignInUseCaseOutput } from '../../../application/useCases/sign-in.use-case';
import { SignInDto } from '../../dtos/sign-in.dto';
import { UpdateUserUseCaseOutput } from '../../../application/useCases/update-user.use-case';
import { UpdateUserDto } from '../../dtos/update-user.dto';
import { UpdatePasswordUseCaseOutput } from '../../../application/useCases/update-password.use-case';
import { UpdatePasswordDto } from '../../dtos/update-password.dto';
import { GetUserUseCaseOutput } from '../../../application/useCases/get-user.use-case';
import { ListUsersUseCaseOutput } from '../../../application/useCases/list-users.use-case';
import { ListUsersDto } from '../../dtos/list-users.dto';

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

  it('should update an user password', async () => {
    const output: UpdatePasswordUseCaseOutput = props;
    const mockUpdatePasswordUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['updatePasswordUseCase'] = mockUpdatePasswordUseCase as any;
    const input: UpdatePasswordDto = {
      newPassword: 'fake',
      oldPassword: 'test',
    };

    const result = await sut.updatePassword(id, input);
    expect(output).toMatchObject(result);
    expect(mockUpdatePasswordUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    });
  });

  it('should delete an user', async () => {
    const output = undefined;
    const mockDeleteUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['deleteUserUseCase'] = mockDeleteUserUseCase as any;

    const result = await sut.remove(id);
    expect(output).toStrictEqual(result);
    expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith({ id });
  });

  it('should get an user', async () => {
    const output: GetUserUseCaseOutput = props;
    const mockGetUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['getUserUseCase'] = mockGetUserUseCase as any;

    const result = await sut.findOne(id);
    expect(output).toStrictEqual(result);
    expect(mockGetUserUseCase.execute).toHaveBeenCalledWith({ id });
  });

  it('should list users', async () => {
    const output: ListUsersUseCaseOutput = {
      items: [props],
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
      total: 1,
    };
    const mockListUsersUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    const input: ListUsersDto = {
      page: 1,
      perPage: 1,
    };
    sut['listUsersUseCase'] = mockListUsersUseCase as any;

    const result = await sut.search(input);
    expect(output).toStrictEqual(result);
    expect(mockListUsersUseCase.execute).toHaveBeenCalledWith(input);
  });
});
