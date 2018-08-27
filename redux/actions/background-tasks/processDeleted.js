"use strict";
export default id => dispatch => dispatch({
  type: 'PROCESSED_DELETED',
  id
});
