import { UserInMemoryRepository } from '../../../../../users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { BCryptjsHashProvider } from '../../../../../users/infrastructure/providers/hashProvider/bcryptjs.hash-provider';
import { InvalidPasswordError } from '../../../../../shared/application/errors/invalid-password.error';
import { userDataBuilder } from '../../../../../users/domain/testing/helpers/user-data-builder';
import { UpdatePasswordUseCase } from '../../update-password.use-case';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { UserEntity } from '../../../../../users/domain/entities/user.entity';

describe('UpdatePasswordUseCase unit test', () => {
  let sut: UpdatePasswordUseCase;
  let repository: UserInMemoryRepository;
  let hashProvider: BCryptjsHashProvider;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BCryptjsHashProvider();
    sut = new UpdatePasswordUseCase(repository, hashProvider);
  });

  it('should throw an error when user is not found', async () => {
    const spyFindById = jest.spyOn(repository, 'findById');
    await expect(
      sut.execute({ id: 'fake', newPassword: 'test', oldPassword: 'test' }),
    ).rejects.toThrow(new NotFoundError('Entity not found'));
    expect(spyFindById).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when old password or new password is not provide', async () => {
    const entity = new UserEntity(userDataBuilder({}));
    repository.items = [entity];
    await expect(
      sut.execute({ id: entity.id, newPassword: '', oldPassword: 'test' }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password is required.'),
    );
    await expect(
      sut.execute({ id: entity.id, newPassword: '', oldPassword: '' }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password is required.'),
    );
    await expect(
      sut.execute({ id: entity.id, newPassword: 'test', oldPassword: '' }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password is required.'),
    );
  });

  it('should throw an error when old password is not the same as the current password', async () => {
    const encryptedPassword = await hashProvider.generateHash('123');
    const entity = new UserEntity(
      userDataBuilder({ password: encryptedPassword }),
    );
    repository.items = [entity];
    await expect(
      sut.execute({ id: entity.id, oldPassword: '456', newPassword: '789' }),
    ).rejects.toThrow(
      new InvalidPasswordError(
        'Old password is not equal to current password.',
      ),
    );
  });

  it('should update password', async () => {
    const encryptedPassword = await hashProvider.generateHash('123');
    const spyUpdate = jest.spyOn(repository, 'update');

    const entity = new UserEntity(
      userDataBuilder({ password: encryptedPassword }),
    );
    repository.items = [entity];

    const result = await sut.execute({
      id: entity.id,
      oldPassword: '123',
      newPassword: '456',
    });

    const checkNewPassword = await hashProvider.compareHash(
      '456',
      result.password,
    );

    expect(checkNewPassword).toBeTruthy();
    expect(spyUpdate).toHaveBeenCalledTimes(1);
  });
});
