import editTask from '../editTask';

describe('editTask', () => {

  it(`should return an object`, () => {
    expect(editTask('abc')).toStrictEqual({
      type: 'TASK_EDITED',
      id: 'abc'
    });
  });

});
