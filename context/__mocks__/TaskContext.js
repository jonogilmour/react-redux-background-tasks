export const updateTasks = jest.fn();
export const getTasks = jest.fn();
export default {
  Consumer: (props) => {
    return props.children({
      updateTasks,
      getTasks
    });
  }
};
