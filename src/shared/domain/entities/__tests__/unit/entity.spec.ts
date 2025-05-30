import { validate as uuidValidate } from 'uuid';
import { Entity } from '../../entity';

type StubProps = {
  prop1: string;
  prop2: number;
};

class StubEntity extends Entity<StubProps> {}

describe('UserEntity unit tests', () => {
  it('should set props and id', () => {
    const props = {
      prop1: 'value1',
      prop2: 15,
    };

    const entity = new StubEntity(props);

    expect(entity.props).toStrictEqual(props);
    expect(entity.id).not.toBeNull();
    expect(uuidValidate(entity.id)).toBeTruthy();
  });

  it('should accepted a valid uuid', () => {
    const props = {
      prop1: 'value1',
      prop2: 15,
    };
    const id = '1703ad38-9686-4a61-8b7a-bc64cc9c5f5c';

    const entity = new StubEntity(props, id);

    expect(uuidValidate(entity.id)).toBeTruthy();
    expect(entity.id).toStrictEqual(id);
  });

  it('shoud convert entity to json', () => {
    const props = {
      prop1: 'value1',
      prop2: 15,
    };
    const id = '1703ad38-9686-4a61-8b7a-bc64cc9c5f5c';

    const entity = new StubEntity(props, id);

    expect(entity.toJSON()).toStrictEqual({ id, ...props });
  });
});
