"use strict";
import React from 'react';

// Allows connected components to update the context-owners' tasks list
export const updateTasks = function(tasks) {
  if(typeof this.setState === 'function') {
    this.setState({
      tasks
    });
  }
};

// TODO: create a suite of shortcut functions to edit/delete/add tasks
// TODO: extend the above to allow an object containing multiple tasks to be passed in and merged with the task list

// Returns a copy of all currently stored tasks
export const getTasks = function() {
  return {
    ...this.state.tasks
  };
};

// Creates a new task storage context
export default React.createContext({
  updateTasks: () => {},
  getTasks: () => {}
});
