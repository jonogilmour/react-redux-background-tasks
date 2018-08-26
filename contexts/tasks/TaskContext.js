import React from 'react';

export const updateTasks = function(tasks) {
  if(typeof this.setState === 'function') {
    this.setState({
      ...this.state,
      tasks
    });
  }
};

export const getTasks = function() {
  return this.state.tasks;
};

export default React.createContext({
  updateTasks: () => {},
  getTasks: () => {}
});
