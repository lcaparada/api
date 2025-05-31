import { userDataBuilder } from '../../../testing/helpers/user-data-builder';
import { UserRules, UserValidator } from '../../user.validator';

describe('UserValidator unit tests', () => {
  let sut: UserValidator;

  beforeEach(() => {
    sut = new UserValidator();
  });

  it('should pass when User props is correct', () => {
    const props = userDataBuilder({});
    const isValid = sut.validate(props);
    expect(isValid).toBeTruthy();
    expect(sut.validatedData).toStrictEqual(new UserRules(props));
    expect(sut.errors).toBeNull();
  });

  describe('Name field', () => {
    it('should throw error when name is empty', () => {
      const isValid = sut.validate({ ...userDataBuilder({}), name: '' });
      expect(isValid).toBeFalsy();
      expect(sut.validatedData).toBe(null);
      expect(sut.errors['name']).toStrictEqual(['name should not be empty']);
    });

    it('should throw error when name is a string', () => {
      const isValid = sut.validate({ ...userDataBuilder({}), name: 10 as any });
      expect(isValid).toBeFalsy();
      expect(sut.validatedData).toBe(null);
      expect(sut.errors['name']).toStrictEqual([
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ]);
    });

    it('should throw error when name has more than 255 characters', () => {
      const isValid = sut.validate({
        ...userDataBuilder({}),
        name: 'a'.repeat(256),
      });
      expect(isValid).toBeFalsy();
      expect(sut.validatedData).toBe(null);
      expect(sut.errors['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
      ]);
    });
  });

  describe('Email field', () => {
    it('should throw error when email is empty', () => {
      const isValid = sut.validate({ ...userDataBuilder({}), email: '' });
      expect(isValid).toBeFalsy();
      expect(sut.validatedData).toBe(null);
      expect(sut.errors['email']).toStrictEqual([
        'email should not be empty',
        'email must be an email',
      ]);
    });

    it('should throw error when email is not a string', () => {
      const isValid = sut.validate({
        ...userDataBuilder({}),
        email: 10 as any,
      });
      expect(isValid).toBeFalsy();
      expect(sut.validatedData).toBe(null);
      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email must be a string',
        'email must be shorter than or equal to 255 characters',
      ]);
    });

    it('should throw error when email has more than 255 characters', () => {
      const isValid = sut.validate({
        ...userDataBuilder({}),
        email: 'a'.repeat(256),
      });
      expect(isValid).toBeFalsy();
      expect(sut.validatedData).toBe(null);
      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email must be shorter than or equal to 255 characters',
      ]);
    });
  });

  describe('Password field', () => {
    it('should throw error when password is empty', () => {
      const isValid = sut.validate({ ...userDataBuilder({}), password: '' });
      expect(isValid).toBeFalsy();
      expect(sut.validatedData).toBe(null);
      expect(sut.errors['password']).toStrictEqual([
        'password should not be empty',
      ]);
    });

    it('should throw error when password is not a string', () => {
      const isValid = sut.validate({
        ...userDataBuilder({}),
        password: 10 as any,
      });
      expect(isValid).toBeFalsy();
      expect(sut.validatedData).toBe(null);
      expect(sut.errors['password']).toStrictEqual([
        'password must be a string',
        'password must be shorter than or equal to 100 characters',
      ]);
    });

    it('should throw error when password has more than 100 characters', () => {
      const isValid = sut.validate({
        ...userDataBuilder({}),
        password: 'a'.repeat(256),
      });
      expect(isValid).toBeFalsy();
      expect(sut.validatedData).toBe(null);
      expect(sut.errors['password']).toStrictEqual([
        'password must be shorter than or equal to 100 characters',
      ]);
    });
  });

  describe('CreatedAt field', () => {
    it('should throw error when createdAt is not date', () => {
      const isValid = sut.validate({
        ...userDataBuilder({}),
        createdAt: '' as any,
      });
      expect(isValid).toBeFalsy();
      expect(sut.validatedData).toBe(null);
      expect(sut.errors['createdAt']).toStrictEqual([
        'createdAt must be a Date instance',
      ]);
    });
  });
});
