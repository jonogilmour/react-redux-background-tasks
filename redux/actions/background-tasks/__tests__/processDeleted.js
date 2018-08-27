"use strict";
import processDeleted from '../processDeleted';

const dispatch = jest.fn();

describe('processDeleted', () => {

  beforeEach(() => {
    dispatch.mockClear();
  });

  it(`should be a thunk`, () => {
    expect(processDeleted()).toBeInstanceOf(Function);
  });

  it(`should dispatch an action with type 'PROCESSED_DELETED'`, () => {
    processDeleted('123')(dispatch);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'PROCESSED_DELETED',
      id: '123'
    });
  });

});
