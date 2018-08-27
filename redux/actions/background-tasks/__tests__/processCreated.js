"use strict";
import processCreated from '../processCreated';

const dispatch = jest.fn();

describe('processCreated', () => {

  beforeEach(() => {
    dispatch.mockClear();
  });

  it(`should be a thunk`, () => {
    expect(processCreated()).toBeInstanceOf(Function);
  });

  it(`should dispatch an action with type 'PROCESSED_CREATED'`, () => {
    processCreated('123')(dispatch);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'PROCESSED_CREATED',
      id: '123'
    });
  });

});
