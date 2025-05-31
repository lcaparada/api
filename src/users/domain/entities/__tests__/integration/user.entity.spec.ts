import { EntityValidationError } from '../../../../../shared/domain/errors/validation-error';
import { userDataBuilder } from '../../../testing/helpers/user-data-builder';
import { UserEntity, UserProps } from '../../user.entity';

describe('UserEntity integration test', () => {
  describe('Constructor method', () => {
    it('should a valid user', () => {
      const props: UserProps = {
        ...userDataBuilder({}),
      };

      expect(() => new UserEntity(props)).not.toThrow(EntityValidationError);
    });
    it('should throw an error when creating a user with invalid name', () => {
      let props: UserProps = {
        ...userDataBuilder({}),
        name: null,
      };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = {
        ...userDataBuilder({}),
        name: '',
      };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = {
        ...userDataBuilder({}),
        name: 'a'.repeat(256),
      };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = {
        ...userDataBuilder({}),
        name: 10 as any,
      };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);
    });

    it('should throw an error when creating with user with invalid password', () => {
      let props: UserProps = {
        ...userDataBuilder({}),
        password: null,
      };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = {
        ...userDataBuilder({}),
        password: '',
      };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = {
        ...userDataBuilder({}),
        password: 'a'.repeat(256),
      };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = {
        ...userDataBuilder({}),
        password: 10 as any,
      };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);
    });

    it('should throw an error when creating with user with invalid email', () => {
      let props: UserProps = {
        ...userDataBuilder({}),
        email: null,
      };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = {
        ...userDataBuilder({}),
        email: '',
      };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = {
        ...userDataBuilder({}),
        email: 'a'.repeat(256),
      };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = {
        ...userDataBuilder({}),
        email: 10 as any,
      };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);
    });

    it('should throw an error when creating with user with created at', () => {
      let props: UserProps = {
        ...userDataBuilder({}),
        createdAt: 10 as any,
      };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = {
        ...userDataBuilder({}),
        createdAt: '2023' as any,
      };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);
    });
  });

  describe('Update method', () => {
    let entity: UserEntity;
    beforeEach(() => {
      const props: UserProps = {
        ...userDataBuilder({}),
      };
      entity = new UserEntity(props);
    });
    it('should throw an error when update user name with invalid data', () => {
      expect(() => entity.updateName('')).toThrow(EntityValidationError);
      expect(() => entity.updateName(10 as any)).toThrow(EntityValidationError);
      expect(() => entity.updateName('a'.repeat(256))).toThrow(
        EntityValidationError,
      );
    });

    it('should throw an error when update user password with invalid data', () => {
      expect(() => entity.updatePassword('')).toThrow(EntityValidationError);
      expect(() => entity.updatePassword(10 as any)).toThrow(
        EntityValidationError,
      );
      expect(() => entity.updatePassword('a'.repeat(101))).toThrow(
        EntityValidationError,
      );
    });

    it('should update password', () => {
      expect(() => entity.updatePassword('123')).not.toThrow(
        EntityValidationError,
      );
    });

    it('should update name', () => {
      expect(() => entity.updateName('John')).not.toThrow(
        EntityValidationError,
      );
    });
  });
});
