"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (id) {
  return function (dispatch) {
    return dispatch({
      type: 'TASK_CREATED',
      id: id
    });
  };
};