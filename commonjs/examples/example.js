"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DApp = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _ = require('../');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_Component) {
  _inherits(App, _Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.state = {
      tasks: {},
      tasksContext: {
        updateTasks: _.updateTasks.bind(_this),
        getTasks: _.getTasks.bind(_this)
      },
      myTaskId: false,
      testFeedback: 0
    };

    _this.create = _this.create.bind(_this);
    _this.delete = _this.delete.bind(_this);
    _this.edit = _this.edit.bind(_this);
    return _this;
  }

  _createClass(App, [{
    key: 'derp',
    value: function derp() {
      return this.state;
    }
  }, {
    key: 'create',
    value: function create() {
      var _this2 = this;

      // Format task
      var newTask = _.TasksHelper.newTask(function () {
        return _this2.setState(function (prevState) {
          return {
            testFeedback: prevState.testFeedback + 1
          };
        });
      }, // Callback
      1000, // Interval
      false // Start on load?
      );

      if (newTask) {
        var id = newTask.id,
            info = _objectWithoutProperties(newTask, ['id']);
        // update context with task info


        this.setState({
          tasks: _extends({}, this.state.tasks, _defineProperty({}, id, info))
        });

        // dispatch task created with id
        this.props.taskCreated(id);

        // save the task id in local state
        this.setState({
          myTaskId: id
        });
      }
    }
  }, {
    key: 'delete',
    value: function _delete() {
      if (this.state.myTaskId) {
        // dispatch task deleted with id
        this.props.taskDeleted(this.state.myTaskId);

        // remove task id from local state
        this.setState({
          myTaskId: false
        });
      }
    }
  }, {
    key: 'edit',
    value: function edit() {
      var _this3 = this;

      // format new task with edits
      var newTask = _.TasksHelper.newTask(function () {
        return _this3.setState(function (prevState) {
          return {
            testFeedback: prevState.testFeedback + 7
          };
        });
      }, // Callback
      2000, // Interval
      true, // Start on load?
      this.state.myTaskId // Manually set id
      );

      if (newTask) {
        var id = newTask.id,
            info = _objectWithoutProperties(newTask, ['id']);

        // change the existing task in the context with the edits


        this.setState({
          tasks: _extends({}, this.state.tasks, _defineProperty({}, id, info))
        });

        // dispatch task edited with id
        this.props.taskEdited(id);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _.TaskContext.Provider,
        { value: this.state.tasksContext },
        _react2.default.createElement(_.TaskRunner, { getTasks: _.getTasks, updateTasks: _.updateTasks }),
        _react2.default.createElement(
          'div',
          { className: 'create-task' },
          _react2.default.createElement(
            'button',
            { type: 'button', onClick: this.create },
            'Create!'
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'delete-task' },
          _react2.default.createElement(
            'button',
            { type: 'button', onClick: this.delete },
            'Delete!'
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'edit-task' },
          _react2.default.createElement(
            'button',
            { type: 'button', onClick: this.edit },
            'Edit!'
          )
        )
      );
    }
  }]);

  return App;
}(_react.Component);

;

var DApp = exports.DApp = App;

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    taskCreated: function taskCreated(id) {
      return dispatch((0, _.createTask)(id));
    },
    taskDeleted: function taskDeleted(id) {
      return dispatch((0, _.deleteTask)(id));
    },
    taskEdited: function taskEdited(id) {
      return dispatch((0, _.editTask)(id));
    }
  };
};

exports.default = (0, _reactRedux.connect)(undefined, mapDispatchToProps)(App);