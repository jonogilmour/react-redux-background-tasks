const defaultState = {
  created: [],
  edited: [],
  deleted: []
};

export default (state = defaultState, action = {}) => {
  const {id, type} = action;
  switch(type) {
    case 'TASK_CREATED':
      if(!state.created.includes(id)) {
        return {
          ...state,
          created: [
            ...state.created,
            id
          ]
        };
      }
      return state;
    case 'TASK_EDITED':
      if(!state.edited.includes(id)) {
        return {
          ...state,
          edited: [
            ...state.edited,
            id
          ]
        };
      }
      return state;
    case 'TASK_DELETED':
      if(!state.deleted.includes(id)) {
        return {
          ...state,
          deleted: [
            ...state.deleted,
            id
          ]
        }
      }
      return state;
    case 'PROCESSED_CREATED':
      return {
        ...state,
        created: state.created.filter(i => i != id)
      }
    case 'PROCESSED_EDITED':
      return {
        ...state,
        edited: state.edited.filter(i => i != id)
      }
    case 'PROCESSED_DELETED':
      return {
        ...state,
        deleted: state.deleted.filter(i => i != id)
      }
    default:
      return state;
  }
};
