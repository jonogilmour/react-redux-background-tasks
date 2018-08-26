import processCreated from '../processCreated';

describe('processCreated', () => {

  it(`should be a thunk`, () => {
    expect(typeof processCreated()).toBe('function');
  });

  describe('thunk function', () => {

    const dispatch = jest.fn();

    beforeEach(() => {
      dispatch.mockClear();
    });

    it(`should call dispatch with an object with 'type' set to 'PROCESSED_CREATED'`, () => {
      processCreated()(dispatch);
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'PROCESSED_CREATED'
        })
      );
    });

    it(`should call dispatch with an object with 'id' set to the passed in id`, () => {
      processCreated(1)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1
        })
      );
    });

  });

});
