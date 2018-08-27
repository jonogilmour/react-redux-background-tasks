"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (id) {
  return function (dispatch) {
    return dispatch({
      type: 'PROCESSED_DELETED',
      id: id
    });
  };
};