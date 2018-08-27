"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var defaultState = {
  created: [],
  edited: [],
  deleted: []
};

exports.default = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var id = action.id,
      type = action.type;

  switch (type) {
    case 'TASK_CREATED':
      if (!state.created.includes(id)) {
        return _extends({}, state, {
          created: [].concat(_toConsumableArray(state.created), [id])
        });
      }
      return state;
    case 'TASK_EDITED':
      if (!state.edited.includes(id)) {
        return _extends({}, state, {
          edited: [].concat(_toConsumableArray(state.edited), [id])
        });
      }
      return state;
    case 'TASK_DELETED':
      if (!state.deleted.includes(id)) {
        return _extends({}, state, {
          deleted: [].concat(_toConsumableArray(state.deleted), [id])
        });
      }
      return state;
    case 'PROCESSED_CREATED':
      return _extends({}, state, {
        created: state.created.filter(function (i) {
          return i != id;
        })
      });
    case 'PROCESSED_EDITED':
      return _extends({}, state, {
        edited: state.edited.filter(function (i) {
          return i != id;
        })
      });
    case 'PROCESSED_DELETED':
      return _extends({}, state, {
        deleted: state.deleted.filter(function (i) {
          return i != id;
        })
      });
    default:
      return state;
  }
};