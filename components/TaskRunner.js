import React, { Component } from 'react';
import { connect } from 'react-redux';
import { processCreated, processEdited, processDeleted } from '../redux/actions';
import PropTypes from 'prop-types';

export class TaskRunner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTasks: {} // Tracks current timers
    };
  }

  startTask(id, info) {
    if(typeof id === 'string' && typeof info === 'object') {
      // Start the callback on an interval
      const timer = setInterval(info.callback, info.interval);

      // Call the callback straight away if startOnLoad is true
      if(info.startOnLoad) {
        info.callback();
      }

      // Remove the id from the created queue
      this.props.processCreated(id);

      // Save the timer to state
      this.setState({
        ...this.state,
        activeTasks: {
          ...this.state.activeTasks,
          [id]: timer
        }
      });
      return true;
    }
    return false;
  }

  killTask(id) {
    if(typeof id === 'string') {
      const { [id]: timer, ...activeTasks } = this.state.activeTasks;

      if(typeof timer !== 'undefined') {
        // Clear the scheduled task
        clearInterval(timer);

        // Pop the task id off the deleted queue
        this.props.processDeleted(id);

        // Reset state.activeTasks with the deleted task removed
        this.setState({
          ...this.state,
          activeTasks
        });
      }

      return true;
    }
    return false;
  }

  editTask(id, info) {
    if(typeof id === 'string' && typeof info === 'object') {

      // Pull out the timer for the task to edit
      const { [id]: timer, ...activeTasks } = this.state.activeTasks;

      if(typeof timer !== 'undefined') {
        // Cancel the task
        clearInterval(timer);

        // Reschedule the task
        const intervalTimer = setInterval(info.callback, info.interval);

        // Run the task straight away as well if startOnLoad is true
        if(info.startOnLoad) {
          info.callback();
        }

        // Pop the task off the edited queue
        this.props.processEdited(id);
        this.setState({
          ...this.state,
          activeTasks: {
            ...activeTasks,
            [id]: intervalTimer
          }
        });
      }

      return true;
    }
    return false;
  }

  componentDidUpdate() {
    const queue = [];
    // Curried function to pass into the promises
    const callback = (fn, i) => resolve => {
      fn(...i);
      resolve();
    };

    if(this.props.created.length) {
      // Pass in the id of the task to start
      const args = [
        this.props.created[0],
        this.props.getTasks()[ this.props.created[0] ]
      ];
      queue.push(
        new Promise(
          callback(this.startTask.bind(this), args)
        )
      );
    }
    if(this.props.edited.length) {
      // Pass in the id and the information about the task
      const args = [
        this.props.edited[0],
        this.props.getTasks()[ this.props.edited[0] ]
      ];
      queue.push(
        new Promise(
          callback(this.editTask.bind(this), args)
        )
      );
    }
    if(this.props.deleted.length) {
      // Pass in the id of the task to delete
      const args = [
        this.props.deleted[0]
      ];
      queue.push(
        new Promise(
          callback(this.killTask.bind(this), args).bind(this)
        )
      );
    }
    return Promise.all(queue);
  }

  render() {
    return null;
  }
}

TaskRunner.propTypes = {
  getTasks: PropTypes.func.isRequired,
  updateTasks: PropTypes.func.isRequired
};

const mapStateToProps = ({ taskQueues }) => ({
  created: taskQueues.created,
  edited: taskQueues.edited,
  deleted: taskQueues.deleted
});

const mapDispatchToProps = (dispatch) => ({
  processCreated: (id) => dispatch(processCreated(id)),
  processEdited: (id) => dispatch(processEdited(id)),
  processDeleted: (id) => dispatch(processDeleted(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskRunner);
