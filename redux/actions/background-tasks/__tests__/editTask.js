"use strict";
import editTask from '../editTask';

const dispatch = jest.fn();

describe('editTask', () => {

  beforeEach(() => {
    dispatch.mockClear();
  });

  it(`should be a thunk`, () => {
    expect(editTask()).toBeInstanceOf(Function);
  });

  it(`should dispatch an action with type 'TASK_EDITED'`, () => {
    editTask('123')(dispatch);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'TASK_EDITED',
      id: '123'
    });
  });

});
