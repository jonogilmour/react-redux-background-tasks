import processDeleted from '../processDeleted';

describe('processDeleted', () => {

  it(`should be a thunk`, () => {
    expect(typeof processDeleted()).toBe('function');
  });

  describe('thunk function', () => {

    const dispatch = jest.fn();

    beforeEach(() => {
      dispatch.mockClear();
    });

    it(`should call dispatch with an object with 'type' set to 'PROCESSED_DELETED'`, () => {
      processDeleted()(dispatch);
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'PROCESSED_DELETED'
        })
      );
    });

    it(`should call dispatch with an object with 'id' set to the passed in id`, () => {
      processDeleted(1)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1
        })
      );
    });

  });

});
