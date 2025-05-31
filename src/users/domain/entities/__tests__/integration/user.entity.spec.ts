import { EntityValidationError } from '../../../../../shared/domain/errors/validation-error';
import { userDataBuilder } from '../../../testing/helpers/user-data-builder';
import { UserEntity, UserProps } from '../../user.entity';

describe('UserEntity integration test', () => {
  describe('Constructor method', () => {
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
  });
});
