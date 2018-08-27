"use strict";
export default id => dispatch => dispatch({
  type: 'TASK_EDITED',
  id
});
