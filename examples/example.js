"use strict";

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  createTask,
  editTask,
  deleteTask,
  TaskRunner,
  TaskContext,
  updateTasks,
  getTasks,
  TaskCreator,
  TasksHelper } from '../';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: {},
      tasksContext: {
        updateTasks: updateTasks.bind(this),
        getTasks: getTasks.bind(this)
      },
      myTaskId: false,
      testFeedback: 0
    };

    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.edit = this.edit.bind(this);
  }

  create() {
    // Format task
    const newTask = TasksHelper.newTask(
      () => this.setState(prevState => ({
        testFeedback: prevState.testFeedback + 1
      })), // Callback
      1000, // Interval
      false // Start on load?
    );

    if(newTask) {
      const { id, ...info } = newTask;
      // update context with task info
      this.setState({
        tasks: {
          ...this.state.tasks,
          [id]: info
        }
      });

      // dispatch task created with id
      this.props.taskCreated(id);

      // save the task id in local state
      this.setState({
        myTaskId: id
      });
    }
  }

  delete() {
    if(this.state.myTaskId) {
      // dispatch task deleted with id
      this.props.taskDeleted(this.state.myTaskId);

      // remove task id from local state
      this.setState({
        myTaskId: false
      });
    }
  }

  edit() {
    // format new task with edits
    const newTask = TasksHelper.newTask(
      () => this.setState(prevState => ({
        testFeedback: prevState.testFeedback + 7
      })), // Callback
      2000, // Interval
      true, // Start on load?
      this.state.myTaskId // Manually set id
    );

    if(newTask) {
      const { id, ...info } = newTask;

      // change the existing task in the context with the edits
      this.setState({
        tasks: {
          ...this.state.tasks,
          [id]: info
        }
      });

      // dispatch task edited with id
      this.props.taskEdited(id);
    }
  }

  render() {
    return (
      <TaskContext.Provider value={this.state.tasksContext}>
        <TaskRunner getTasks={getTasks} updateTasks={updateTasks}/>

        <div className="create-task">
          <button type="button" onClick={this.create}>Create!</button>
        </div>

        <div className="delete-task">
          <button type="button" onClick={this.delete}>Delete!</button>
        </div>

        <div className="edit-task">
          <button type="button" onClick={this.edit}>Edit!</button>
        </div>

      </TaskContext.Provider>
    );
  }
};

export const DApp = App;

const mapDispatchToProps = dispatch => ({
  taskCreated: id => dispatch(createTask(id)),
  taskDeleted: id => dispatch(deleteTask(id)),
  taskEdited:  id => dispatch(editTask(id))
})

export default connect(undefined, mapDispatchToProps)(App);
