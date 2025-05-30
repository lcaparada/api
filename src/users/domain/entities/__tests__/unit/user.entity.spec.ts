import { userDataBuilder } from '../../../testing/helpers/user-data-builder';
import { UserEntity, UserProps } from '../../user.entity';

describe('UserEntity unit tests', () => {
  let props: UserProps;
  let sut: UserEntity;

  beforeEach(() => {
    props = userDataBuilder({});

    sut = new UserEntity(props);
  });
  it('constructor method ', () => {
    expect(sut.props.name).toEqual(props.name);
    expect(sut.props.email).toEqual(props.email);
    expect(sut.props.password).toEqual(props.password);
    expect(sut.props.createdAt).toBeInstanceOf(Date);
  });

  it('should getter of name', () => {
    expect(sut.name).toBeDefined();
    expect(sut.name).toEqual(props.name);
    expect(typeof sut.name).toBe('string');
  });

  it('should getter created at', () => {
    expect(sut.createdAt).toBeDefined();
    expect(sut.createdAt).toBeInstanceOf(Date);
  });

  it('should getter email', () => {
    expect(sut.email).toBeDefined();
    expect(sut.email).toEqual(props.email);
    expect(typeof sut.email).toBe('string');
  });

  it('should getter password', () => {
    expect(sut.password).toBeDefined();
    expect(sut.password).toEqual(props.password);
    expect(typeof sut.password).toBe('string');
  });

  it('should setter name', () => {
    const newName = 'other name';
    sut['name'] = newName;
    expect(sut.name).toEqual(newName);
    expect(typeof sut.name).toBe('string');
  });

  it('should setter password', () => {
    const newPassword = 'otherPassword';
    sut['password'] = newPassword;
    expect(sut.password).toEqual(newPassword);
    expect(typeof sut.name).toBe('string');
  });

  it('should update name', () => {
    const newName = 'other name';
    sut.updateName(newName);
    expect(sut.name).toEqual(newName);
    expect(typeof sut.name).toBe('string');
  });

  it('should update password', () => {
    const newPassword = 'otherpassword';
    sut.updatePassword(newPassword);
    expect(sut.password).toEqual(newPassword);
    expect(typeof sut.password).toEqual('string');
  });
});
