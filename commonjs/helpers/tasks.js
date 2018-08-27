"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Returns a properly formatted task object, with a random identifier
 */

var TasksHelper = function () {
  function TasksHelper() {
    _classCallCheck(this, TasksHelper);
  }

  _createClass(TasksHelper, null, [{
    key: 'newTask',
    value: function newTask(callback) {
      var interval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
      var startOnLoad = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var id = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : (0, _v2.default)();

      if (typeof callback !== 'function') {
        return false;
      }
      return {
        id: id,
        callback: callback,
        interval: interval,
        startOnLoad: startOnLoad
      };
    }
  }]);

  return TasksHelper;
}();

exports.default = TasksHelper;
;