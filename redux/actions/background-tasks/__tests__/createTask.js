import createTask from '../createTask';

describe('createTask', () => {

  it(`should return an object`, () => {
    expect(createTask('123')).toStrictEqual({
      type: 'TASK_CREATED',
      id: '123'
    });
  });

});
