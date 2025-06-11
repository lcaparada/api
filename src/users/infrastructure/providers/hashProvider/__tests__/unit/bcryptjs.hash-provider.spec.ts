import { BCryptjsHashProvider } from '../../bcryptjs.hash-provider';

describe('BCryptjsHashProvider', () => {
  let sut: BCryptjsHashProvider;
  beforeEach(() => {
    sut = new BCryptjsHashProvider();
  });
  describe('GenerateHash method', () => {
    it('should return encrypted password', async () => {
      const password = 'test';
      const encryptedPassword = await sut.generateHash(password);

      expect(encryptedPassword).toBeDefined();
    });
  });
  describe('CompareHash method', () => {
    it('should return true if the password is equal to the encrypted password', async () => {
      const password = 'test';
      const encryptedPassword = await sut.generateHash(password);

      const isEqual = await sut.compareHash(password, encryptedPassword);

      expect(isEqual).toBeTruthy();
    });

    it('should return false if the password is not equal to the encrypted password', async () => {
      const password = 'test';
      const encryptedPassword = await sut.generateHash(password);

      const isEqual = await sut.compareHash('123', encryptedPassword);

      expect(isEqual).toBeFalsy();
    });
  });
});
