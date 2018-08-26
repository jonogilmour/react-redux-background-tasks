import processEdited from '../processEdited';

describe('processEdited', () => {

  it(`should be a thunk`, () => {
    expect(typeof processEdited()).toBe('function');
  });

  describe('thunk function', () => {

    const dispatch = jest.fn();

    beforeEach(() => {
      dispatch.mockClear();
    });

    it(`should call dispatch with an object with 'type' set to 'PROCESSED_EDITED'`, () => {
      processEdited()(dispatch);
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'PROCESSED_EDITED'
        })
      );
    });

    it(`should call dispatch with an object with 'id' set to the passed in id`, () => {
      processEdited(1)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1
        })
      );
    });

  });

});
