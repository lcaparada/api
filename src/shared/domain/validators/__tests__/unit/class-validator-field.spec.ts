import { ClassValidatorFields } from '../../class-validator-fields';
import * as libClassValidator from 'class-validator';

class StubClassValidatorFields extends ClassValidatorFields<{
  field: string;
}> {}

describe('ClassValidatorFields unit tests', () => {
  let sut: StubClassValidatorFields;

  beforeEach(() => {
    sut = new StubClassValidatorFields();
  });

  it('should errors to be null', () => {
    expect(sut.errors).toBe(null);
  });

  it('should validatedData to be null', () => {
    expect(sut.validatedData).toBe(null);
  });

  it('should be validate with errors', () => {
    const validateSyncSpy = jest.spyOn(libClassValidator, 'validateSync');

    validateSyncSpy.mockReturnValue([
      { property: 'field', constraints: { isRequired: 'test error' } },
    ]);

    expect(sut.validate(null)).toBeFalsy();
    expect(sut.validatedData).toBeNull();
    expect(validateSyncSpy).toHaveBeenCalled();
    expect(sut.errors).not.toBeNull();
  });

  it('should be validate without errors', () => {
    const data = {
      field: 'ola',
    };

    const validateSyncSpy = jest.spyOn(libClassValidator, 'validateSync');

    validateSyncSpy.mockReturnValue([]);

    expect(sut.validate(data)).toBeTruthy();
    expect(sut.validatedData).toBe(data);
    expect(validateSyncSpy).toHaveBeenCalled();
    expect(sut.errors).toBeNull();
  });
});
