"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskRunner = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _actions = require('../redux/actions');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _TaskCreator = require('../context/TaskCreator');

var _TaskCreator2 = _interopRequireDefault(_TaskCreator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * The main task manager. Keeps track of all running task timers in state.
 *
 * This component needs to be placed within your tasks context, preferably
 * at the root of your app to prevent it being rerendered unnecessarily.
 *
 * When a task is added, edited, or deleted, this component manages the
 * dispatching of interval timers for the task.
 */

var TaskRunner = exports.TaskRunner = function (_Component) {
  _inherits(TaskRunner, _Component);

  function TaskRunner(props) {
    _classCallCheck(this, TaskRunner);

    var _this = _possibleConstructorReturn(this, (TaskRunner.__proto__ || Object.getPrototypeOf(TaskRunner)).call(this, props));

    _this.state = {
      activeTasks: {} // Tracks current timers
    };
    return _this;
  }

  // Dispatches a new task


  _createClass(TaskRunner, [{
    key: 'startTask',
    value: function startTask(id, info) {
      if (typeof id === 'string' && (typeof info === 'undefined' ? 'undefined' : _typeof(info)) === 'object') {
        // Start the callback on an interval
        var timer = setInterval(info.callback, info.interval);

        // Call the callback straight away if startOnLoad is true
        if (info.startOnLoad) {
          info.callback();
        }

        // Remove the id from the created queue
        this.props.processCreated(id);

        // Save the timer to state
        this.setState(_extends({}, this.state, {
          activeTasks: _extends({}, this.state.activeTasks, _defineProperty({}, id, timer))
        }));
        return true;
      }
      return false;
    }

    // Deletes an existing task

  }, {
    key: 'killTask',
    value: function killTask(id) {
      if (typeof id === 'string') {
        var _state$activeTasks = this.state.activeTasks,
            timer = _state$activeTasks[id],
            activeTasks = _objectWithoutProperties(_state$activeTasks, [id]);

        if (typeof timer !== 'undefined') {
          // Clear the scheduled task
          clearInterval(timer);

          // Pop the task id off the deleted queue
          this.props.processDeleted(id);

          // Reset state.activeTasks with the deleted task removed
          this.setState(_extends({}, this.state, {
            activeTasks: activeTasks
          }));

          // TODO: remove the task from the context
        }

        return true;
      }
      return false;
    }

    // Edits details of an existing task, restarting it afterwards

  }, {
    key: 'editTask',
    value: function editTask(id, info) {
      if (typeof id === 'string' && (typeof info === 'undefined' ? 'undefined' : _typeof(info)) === 'object') {

        // Pull out the timer for the task to edit
        var _state$activeTasks2 = this.state.activeTasks,
            timer = _state$activeTasks2[id],
            activeTasks = _objectWithoutProperties(_state$activeTasks2, [id]);

        if (typeof timer !== 'undefined') {
          // Cancel the task
          clearInterval(timer);

          // Reschedule the task
          var intervalTimer = setInterval(info.callback, info.interval);

          // Run the task straight away as well if startOnLoad is true
          if (info.startOnLoad) {
            info.callback();
          }

          // Pop the task off the edited queue
          this.props.processEdited(id);
          this.setState(_extends({}, this.state, {
            activeTasks: _extends({}, activeTasks, _defineProperty({}, id, intervalTimer))
          }));
        }
        // TODO: task doesn't exist, maybe create it instead

        return true;
      }
      return false;
    }

    // Component will update when a new, edited, or deleted task is awaiting processing

  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var queue = [];
      // Curried function to pass into the promises
      var callback = function callback(fn, i) {
        return function (resolve) {
          fn.apply(undefined, _toConsumableArray(i));
          resolve();
        };
      };

      if (this.props.created.length) {
        // Pass in the id of the task to start
        var args = [this.props.created[0], this.props.getTasks()[this.props.created[0]]];
        queue.push(new Promise(callback(this.startTask.bind(this), args)));
      }
      if (this.props.edited.length) {
        // Pass in the id and the information about the task
        var _args = [this.props.edited[0], this.props.getTasks()[this.props.edited[0]]];
        queue.push(new Promise(callback(this.editTask.bind(this), _args)));
      }
      if (this.props.deleted.length) {
        // Pass in the id of the task to delete
        var _args2 = [this.props.deleted[0]];
        queue.push(new Promise(callback(this.killTask.bind(this), _args2).bind(this)));
      }
      return Promise.all(queue);
    }
  }, {
    key: 'render',
    value: function render() {
      return null;
    }
  }]);

  return TaskRunner;
}(_react.Component);

TaskRunner.propTypes = {
  getTasks: _propTypes2.default.func.isRequired,
  updateTasks: _propTypes2.default.func.isRequired
};

var mapStateToProps = function mapStateToProps(_ref) {
  var taskQueues = _ref.taskQueues;
  return {
    created: taskQueues.created,
    edited: taskQueues.edited,
    deleted: taskQueues.deleted
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    processCreated: function processCreated(id) {
      return dispatch((0, _actions.processCreated)(id));
    },
    processEdited: function processEdited(id) {
      return dispatch((0, _actions.processEdited)(id));
    },
    processDeleted: function processDeleted(id) {
      return dispatch((0, _actions.processDeleted)(id));
    }
  };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _TaskCreator2.default)(TaskRunner));