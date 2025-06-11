import { UserInMemoryRepository } from '../../../../../users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { SignUpUseCase } from '../../sign-up.use-case';
import { BCryptjsHashProvider } from '../../../../../users/infrastructure/providers/hashProvider/bcryptjs.hash-provider';
import { BadRequestError } from '../../../../../users/application/errors/bad-request.error';
import { userDataBuilder } from '../../../../../users/domain/testing/helpers/user-data-builder';
import { ConflictError } from '../../../../../shared/domain/errors/conflict.error';

describe('SignUpUseCase unit test', () => {
  let sut: SignUpUseCase;
  let repository: UserInMemoryRepository;
  let hashProvider: BCryptjsHashProvider;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BCryptjsHashProvider();
    sut = new SignUpUseCase(repository, hashProvider);
  });

  it('should return error when name, email or password is not provide', async () => {
    await expect(
      sut.execute({ email: '', name: '', password: '' }),
    ).rejects.toThrow(new BadRequestError('Input data does not provider'));

    await expect(
      sut.execute({ email: 'test@test.com', name: '', password: '' }),
    ).rejects.toThrow(new BadRequestError('Input data does not provider'));

    await expect(
      sut.execute({ email: 'test@test.com', name: 'test', password: '' }),
    ).rejects.toThrow(new BadRequestError('Input data does not provider'));

    await expect(
      sut.execute({ email: '', name: '', password: '123' }),
    ).rejects.toThrow(new BadRequestError('Input data does not provider'));

    await expect(sut.execute(null)).rejects.toThrow(
      new BadRequestError('Input data does not provider'),
    );
  });

  it('should create a user', async () => {
    const spyInsert = jest.spyOn(repository, 'insert');
    const props = userDataBuilder({});
    const result = await sut.execute(props);

    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it('should not be able to register an user with same email', async () => {
    const props = userDataBuilder({ email: 'a@a.com' });
    await sut.execute(props);

    await expect(sut.execute(props)).rejects.toThrow(
      new ConflictError(`Email already exists!`),
    );
  });
});
