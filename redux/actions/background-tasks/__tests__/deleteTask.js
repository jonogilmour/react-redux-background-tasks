import deleteTask from '../deleteTask';

describe('deleteTask', () => {

  it(`should return an action with type 'TASK_DELETED'`, () => {
    expect(deleteTask().type).toBe('TASK_DELETED');
  });

  it(`should assign id to the input value`, () => {
    expect(deleteTask('9999a')).toMatchObject({
      id: '9999a'
    });
  });

});
