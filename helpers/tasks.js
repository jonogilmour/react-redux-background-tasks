import uuidv4 from 'uuid/v4';

export default class TasksHelper {
  static newTask(callback, interval = 1000, startOnLoad = false, id = uuidv4()) {
    if(typeof callback !== 'function') {
      return false;
    }
    return {
      id,
      callback,
      interval,
      startOnLoad
    };
  }
}
