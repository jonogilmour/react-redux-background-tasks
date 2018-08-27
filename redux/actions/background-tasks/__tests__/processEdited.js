"use strict";
import processEdited from '../processEdited';

const dispatch = jest.fn();

describe('processEdited', () => {

  beforeEach(() => {
    dispatch.mockClear();
  });

  it(`should be a thunk`, () => {
    expect(processEdited()).toBeInstanceOf(Function);
  });

  it(`should dispatch an action with type 'PROCESSED_EDITED'`, () => {
    processEdited('123')(dispatch);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'PROCESSED_EDITED',
      id: '123'
    });
  });

});
