"use strict";
/*
 * Takes a component and returns a new component with access to the Tasks context
 */

import React from 'react';
import TaskContext from './TaskContext';

export const TaskCreator = Component => props => (
  <TaskContext.Consumer>
    {
      ({getTasks, updateTasks}) => <Component {...props} getTasks={getTasks} updateTasks={updateTasks}/>
    }
  </TaskContext.Consumer>
);

export default TaskCreator;
