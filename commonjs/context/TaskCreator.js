"use strict";
/*
 * Takes a component and returns a new component with access to the Tasks context
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskCreator = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TaskContext = require('./TaskContext');

var _TaskContext2 = _interopRequireDefault(_TaskContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TaskCreator = exports.TaskCreator = function TaskCreator(Component) {
  return function (props) {
    return _react2.default.createElement(
      _TaskContext2.default.Consumer,
      null,
      function (_ref) {
        var getTasks = _ref.getTasks,
            updateTasks = _ref.updateTasks;
        return _react2.default.createElement(Component, _extends({}, props, { getTasks: getTasks, updateTasks: updateTasks }));
      }
    );
  };
};

exports.default = TaskCreator;