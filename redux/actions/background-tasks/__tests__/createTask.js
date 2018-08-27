"use strict";
import createTask from '../createTask';

const dispatch = jest.fn();

describe('createTask', () => {

  beforeEach(() => {
    dispatch.mockClear();
  });

  it(`should be a thunk`, () => {
    expect(createTask()).toBeInstanceOf(Function);
  });

  it(`should return an object`, () => {
    createTask('123')(dispatch);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'TASK_CREATED',
      id: '123'
    });
  });

});
