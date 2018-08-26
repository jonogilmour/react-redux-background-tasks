import TasksHelper from '../tasks';
import uuidv4 from 'uuid/v4';
jest.mock('uuid/v4', () => jest.fn(() => 'abcdef-g12345'));

describe('TasksHelper.class.newTask', () => {

  beforeEach(() => {
    uuidv4.mockClear();
  });

  it(`should return false if callback is not a function`, () => {
    expect(TasksHelper.newTask('notafunction')).toBe(false);
  });

  it(`should return an object if callback is a function`, () => {
    expect(typeof TasksHelper.newTask(() => null)).toBe('object');
  });

  it(`should return an object with a random id field`, () => {
    const task = TasksHelper.newTask(() => null);
    expect(task.id).toBe('abcdef-g12345');
  });

  it(`should call uuid/v4 to generate the id`, () => {
    TasksHelper.newTask(() => null);
    expect(uuidv4).toHaveBeenCalled();
  });

  it(`should return an object with a property 'callback' set to the callback function passed in`, () => {
    const cb = () => null;
    expect(TasksHelper.newTask(cb).callback).toBe(cb);
  });

  it(`should return an object with a property 'interval' set to the number passed in`, () => {
    const cb = () => null;
    const i = 100;
    expect(TasksHelper.newTask(cb, i).interval).toBe(100);
  });

  it(`should return an object with a property 'startOnLoad' set to the boolean passed in`, () => {
    const cb = () => null;
    const i = 100;
    const sOL = true;
    expect(TasksHelper.newTask(cb, i, sOL).startOnLoad).toBe(true);
  });

  it(`should set defaults for interval and startOnLoad`, () => {
    const cb = () => null;
    const task = TasksHelper.newTask(cb);
    expect(task.interval).toBe(1000);
    expect(task.startOnLoad).toBe(false);
  });

  it(`should set the id manually if passed in`, () => {
    const cb = () => null;
    const i = 100;
    const sOL = true;
    const id = 'abcdefg';
    expect(TasksHelper.newTask(cb, i, sOL, id).id).toBe('abcdefg');
  });

});
