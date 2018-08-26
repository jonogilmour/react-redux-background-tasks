import tasksReducer from '../tasks';

describe('tasksReducer', () => {

  it(`should return the state unaltered if action type undefined or unrecognised`, () => {
    const state = {
      created: [],
      edited: [],
      deleted: []
    };
    expect(tasksReducer(state, {})).toBe(state);
  });

  it(`should return a tasks state object`, () => {
    expect(tasksReducer(undefined, {})).toStrictEqual({
      created: [],
      edited: [],
      deleted: []
    });
  });

  describe('TASK_CREATED', () => {

    it(`should return an object`, () => {
      expect(tasksReducer(undefined, {
        type: 'TASK_CREATED'
      })).toStrictEqual({
        created: expect.any(Array),
        edited: expect.any(Array),
        deleted: expect.any(Array)
      });
    });

    it(`should add the task id to the 'created' queue`, () => {
      const action = {
        type: 'TASK_CREATED',
        id: 'abc123',
        interval: 1000,
        startOnLoad: false
      };
      const state = {
        created: ['xyz']
      };
      expect(tasksReducer(state, action).created).toEqual(['xyz', 'abc123']);
    });

  });

  describe('TASK_EDITED', () => {

    it(`should return an object`, () => {
      expect(tasksReducer(undefined, {
        type: 'TASK_EDITED'
      })).toStrictEqual({
        created: expect.any(Array),
        edited: expect.any(Array),
        deleted: expect.any(Array)
      });
    });

    it(`should add the id to the edited queue`, () => {
      const state = {
        edited: ['bar']
      }
      const action = {
        type: 'TASK_EDITED',
        id: 'foo',
        startOnLoad: false,
        interval: 988
      };
      expect(tasksReducer(state, action).edited).toEqual(
        ['bar', 'foo']
      );
    });

  });

  describe('TASK_DELETED', () => {

    it(`should return an object`, () => {
      expect(tasksReducer(undefined, {
        type: 'TASK_DELETED'
      })).toStrictEqual({
        created: expect.any(Array),
        edited: expect.any(Array),
        deleted: expect.any(Array)
      });
    });

    it(`should add the task id to the deleted queue`, () => {
      const state = {
        deleted: ['bar'],
        tasks: {
          foo: {
            callback: 'function',
            interval: 123,
            startOnLoad: true
          },
          baz: {
            callback: 'otherfunc',
            interval: 200,
            startOnLoad: false
          }
        }
      }
      const action = {
        type: 'TASK_DELETED',
        id: 'foo'
      };
      expect(tasksReducer(state, action).deleted).toEqual(
        ['bar', 'foo']
      );
    });

  });

  describe('PROCESSED_CREATED', () => {

    it(`should return an object`, () => {
      expect(tasksReducer(undefined, {
        type: 'PROCESSED_CREATED'
      })).toStrictEqual({
        created: expect.any(Array),
        edited: expect.any(Array),
        deleted: expect.any(Array)
      });
    });

    it(`should remove the processed id from the created queue`, () => {
      const state = {
        created: ['abc', 'defg']
      };
      expect(tasksReducer(state, {
        type: 'PROCESSED_CREATED',
        id: 'abc'
      })).toStrictEqual({
        created: ['defg']
      });
    });

    it(`should return the state unaltered if the id doesn't exist in the created queue`, () => {
      const state = {
        created: ['abc', 'defg']
      };
      expect(tasksReducer(state, {
        type: 'PROCESSED_CREATED',
        id: 'something'
      })).toStrictEqual({
        created: ['abc', 'defg']
      });
    });

  });

  describe('PROCESSED_EDITED', () => {

    it(`should return an object`, () => {
      expect(tasksReducer(undefined, {
        type: 'PROCESSED_EDITED'
      })).toStrictEqual({
        created: expect.any(Array),
        edited: expect.any(Array),
        deleted: expect.any(Array)
      });
    });

    it(`should remove the processed id from the edited queue`, () => {
      const state = {
        edited: ['abc', 'defg']
      };
      expect(tasksReducer(state, {
        type: 'PROCESSED_EDITED',
        id: 'abc'
      })).toStrictEqual({
        edited: ['defg']
      });
    });

    it(`should return the state unaltered if the id doesn't exist in the edited queue`, () => {
      const state = {
        edited: ['abc', 'defg']
      };
      expect(tasksReducer(state, {
        type: 'PROCESSED_EDITED',
        id: 'something'
      })).toStrictEqual({
        edited: ['abc', 'defg']
      });
    });

  });

  describe('PROCESSED_DELETED', () => {

    it(`should return an object`, () => {
      expect(tasksReducer(undefined, {
        type: 'PROCESSED_DELETED'
      })).toStrictEqual({
        created: expect.any(Array),
        edited: expect.any(Array),
        deleted: expect.any(Array)
      });
    });

    it(`should remove the processed id from the edited queue`, () => {
      const state = {
        deleted: ['abc', 'defg']
      };
      expect(tasksReducer(state, {
        type: 'PROCESSED_DELETED',
        id: 'abc'
      })).toStrictEqual({
        deleted: ['defg']
      });
    });

    it(`should return the state unaltered if the id doesn't exist in the edited queue`, () => {
      const state = {
        deleted: ['abc', 'defg']
      };
      expect(tasksReducer(state, {
        type: 'PROCESSED_DELETED',
        id: 'something'
      })).toStrictEqual({
        deleted: ['abc', 'defg']
      });
    });

  });

});
