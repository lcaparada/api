import { UserInMemoryRepository } from '../../../../../users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { BCryptjsHashProvider } from '../../../../../users/infrastructure/providers/hashProvider/bcryptjs.hash-provider';
import { BadRequestError } from '../../../../../shared/application/errors/bad-request.error';
import { userDataBuilder } from '../../../../../users/domain/testing/helpers/user-data-builder';
import { SignInUseCase } from '../../sign-in.use-case';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { UserEntity } from '../../../../../users/domain/entities/user.entity';
import { InvalidCredentialsError } from '../../../../../shared/application/errors/invalid-credentials.error';

describe('SignInUseCase unit test', () => {
  let sut: SignInUseCase;
  let repository: UserInMemoryRepository;
  let hashProvider: BCryptjsHashProvider;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BCryptjsHashProvider();
    sut = new SignInUseCase(repository, hashProvider);
  });

  it('should return error when email or password is not provide', async () => {
    await expect(sut.execute({ email: '', password: '123' })).rejects.toThrow(
      new BadRequestError('Email and password is required.'),
    );
    await expect(
      sut.execute({ email: 'a@a.com', password: '' }),
    ).rejects.toThrow(new BadRequestError('Email and password is required.'));
    await expect(sut.execute({ email: '', password: '' })).rejects.toThrow(
      new BadRequestError('Email and password is required.'),
    );
  });

  it('should return error when user does not exist', async () => {
    const spyFindByEmail = jest.spyOn(repository, 'findByEmail');
    await expect(
      sut.execute({ email: 'a@a.com', password: '123' }),
    ).rejects.toThrow(
      new NotFoundError(`Entity not found using user email:a@a.com`),
    );
    expect(spyFindByEmail).toHaveBeenCalledTimes(1);
  });

  it('should throw error when pass invalid credentials', async () => {
    const spyFindByEmail = jest.spyOn(repository, 'findByEmail');
    const spyCompareHash = jest.spyOn(hashProvider, 'compareHash');
    const hashPassword = await hashProvider.generateHash('123');
    const items = [new UserEntity(userDataBuilder({ password: hashPassword }))];
    repository.items = items;
    await expect(
      sut.execute({ email: items[0].email, password: 'fake' }),
    ).rejects.toThrow(new InvalidCredentialsError('Invalid credentials.'));
    expect(spyFindByEmail).toHaveBeenCalledTimes(1);
    expect(spyCompareHash).toHaveBeenCalledTimes(1);
  });

  it('should sign in', async () => {
    const spyFindByEmail = jest.spyOn(repository, 'findByEmail');
    const spyCompareHash = jest.spyOn(hashProvider, 'compareHash');
    const hashPassword = await hashProvider.generateHash('123');
    const entity = new UserEntity(userDataBuilder({ password: hashPassword }));
    repository.items = [entity];
    const result = await sut.execute({ email: entity.email, password: '123' });
    expect(result).toStrictEqual(entity.toJSON());
    expect(spyFindByEmail).toHaveBeenCalledTimes(1);
    expect(spyCompareHash).toHaveBeenCalledTimes(1);
  });
});
