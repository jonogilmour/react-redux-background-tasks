"use strict";
import deleteTask from '../deleteTask';

const dispatch = jest.fn();

describe('deleteTask', () => {

  beforeEach(() => {
    dispatch.mockClear();
  });

  it(`should be a thunk`, () => {
    expect(deleteTask()).toBeInstanceOf(Function);
  });

  it(`should dispatch an action with type 'TASK_DELETED'`, () => {
    deleteTask('123')(dispatch);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'TASK_DELETED',
      id: '123'
    });
  });

});
