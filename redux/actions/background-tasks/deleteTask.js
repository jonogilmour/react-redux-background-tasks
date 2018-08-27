"use strict";
export default id => dispatch => dispatch({
  type: 'TASK_DELETED',
  id
});
