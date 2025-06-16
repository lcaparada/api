import { UserEntity } from '../../../../../users/domain/entities/user.entity';
import { userDataBuilder } from '../../../../../users/domain/testing/helpers/user-data-builder';
import { UserOutputMapper } from '../../user-output.dto';

describe('UserOutputMapper unit tests', () => {
  it('should convert a user to output', () => {
    const entity = new UserEntity(userDataBuilder({}));
    const spyToJson = jest.spyOn(entity, 'toJSON');
    const sut = UserOutputMapper.toOutput(entity);

    expect(spyToJson).toHaveBeenCalledTimes(1);
    expect(sut).toStrictEqual(entity.toJSON());
  });
});
