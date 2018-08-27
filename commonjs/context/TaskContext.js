"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTasks = exports.updateTasks = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Allows connected components to update the context-owners' tasks list
var updateTasks = exports.updateTasks = function updateTasks(tasks) {
  if (typeof this.setState === 'function') {
    this.setState({
      tasks: tasks
    });
  }
};

// TODO: create a suite of shortcut functions to edit/delete/add tasks
// TODO: extend the above to allow an object containing multiple tasks to be passed in and merged with the task list

// Returns a copy of all currently stored tasks
var getTasks = exports.getTasks = function getTasks() {
  return _extends({}, this.state.tasks);
};

// Creates a new task storage context
exports.default = _react2.default.createContext({
  updateTasks: function updateTasks() {},
  getTasks: function getTasks() {}
});