# React Redux Background Tasks

[![Build Status](https://travis-ci.com/jonogilmour/react-redux-background-tasks.svg?branch=master)](https://travis-ci.com/jonogilmour/react-redux-background-tasks)

Dispatch and manage interval-based tasks in your React + Redux app.

## Installation

`
npm i react-redux-background-tasks
`

## Why?

Building React apps, I often found myself without a reliable, global way to run functions on an interval without having to stuff the task into a specific component's state. This becomes especially difficult when dealing with global tasks, such as renewing a stored user token.

This library simplifies that process and allows any Redux-connected component to dispatch tasks that can be seen and managed by any other component.

## Requirements

Relies on **Redux**, **redux-thunk**, and the **React Context API**, so React v16+ is required.

## Example

Let's say you have a global user token in your Redux store, and it expires every 60 minutes. Obviously we want to renew that in advance, to keep the user session going.

```javascript
const rootReducer = combineReducers({
  taskQueues: taskReducer, // See Reducers in Usage
  userToken: userTokenReducer
})
const store = createStore(rootReducer); // Also add in thunk middleware

const App = () =>  (
  <Provider store={store}>
    <MyApp/>
  </Provider>
);
```

This sets up the basic starting point of our app, we have the `taskQueues` added to the Redux store, and a user token, maybe with an expiry time attached. Let's create a simple connected component that will log the user in, and dispatch the new refresh task.

```javascript
class MyApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginTaskId: false // This component owns this task, so we store the task id in its state in case we need to cancel it later
    };
  }

  loginUser() {
    const username = 'myUser';
    const password = 'mysecurepassword';

    const token = LoginHelper.login(username, password); // Your own login method

    // Add the token info to redux store
    this.props.loginUser(token);

    // Create a new task object
    const newTask = TasksHelper.newTask(
      () => LoginHelper.extendSession(token), // Callback
      60 * 60 * 1000 // 60 minute interval
    );

    if(newTask) {
      const {id, ...taskInfo} = newTask; // Pull out the ID and the rest of the info separately

      this.props.updateTasks({
        ...this.props.getTasks(),
        [id]: taskInfo
      }); // Set the tasks list in the context, adding our new task in

      // Tell the rest of the app a new task is waiting to be scheduled
      this.createTask(id);

      // Save the ID in case we want to change or cancel this task later
      this.setState({
        loginTaskId: id
      });
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.loginUser.bind(this)}>Click to login!</button>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loginUser: token => dispatch(loginUser(token)),
  createTask: id => dispatch(taskCreated(id))
});

export default connect(undefined, mapDispatchToProps)(MyComponent);
```

```javascript
// Give our component access to the task getter/setter methods
const MyTaskCreator = TaskCreator(MyComponent);
class MyApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: {}, // used to store global
    };

    // Automatically returns this.state.tasks
    this.getTasks = getTasks.bind(this);
    // Updates the contents of this.state.tasks
    this.updateTasks = updateTasks.bind(this);
  }

  render() {
    return (
      <TaskContext.Provider value={{
        getTasks: this.getTasks,
        updateTasks: this.updateTasks
      }}>
        <TaskRunner/> // Consumes all changes to the task queues
        <MyTaskCreator>
      </TaskContext.Provider>
    );
  }
}
```

Clicking the login button in our `MyComponent` will:
- Login to our app, setting the token in the redux store
- Create a new session extend task, set to run every 60 minutes
- Save the task under its ID to the TasksContext
- Dispatch a `taskCreated` action, which lets `TaskRunner` know there's a new task to schedule

Now, every 60 minutes your session token will be extended!

## Functionality

### Redux

Three task queues are stored in the Redux store. Each is an array where task identifiers are added.

- **Created** queue: New tasks waiting to be dispatched
- **Edited** queue: Existing tasks with changes to be made
- **Deleted** queue: Existing tasks that will be destroyed

### Task Context

Task information is stored in the `TaskContext` in the following form

```javascript
{
  'mytask1' : {
    callback: Function,
    interval: Number (ms),
    startOnLoad: Boolean
  },
  ...
}
```
When a new task is created, its full information must be stored in the context.

### TaskCreators

A `TaskCreator` is a consumer of the `TaskContext`. Any component can be a `TaskCreator`, and access to the tasks store is added automatically via an API. `TaskRunner` (see Usage below) is a `TaskCreator`.

## Usage

The library comes with several key components.

#### TaskContext

`import { TaskContext, getTasks, updateTasks } from 'react-redux-background-tasks'`

Exposes a `Provider` that you use to expose the context store to your components. Also exposes methods to cleanly pass in accessor methods to your `TaskCreators`.

```javascript
class MyApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: {},
    };

    // Returns a copy of this.state.tasks
    this.getTasks = getTasks.bind(this);
    // Updates the contents of this.state.tasks
    this.updateTasks = updateTasks.bind(this);
  }

  render() {
    return (
      <TaskContext.Provider value={{
        getTasks: this.getTasks,
        updateTasks: this.updateTasks
      }}>
        // Your app
      </TaskContext.Provider>
    );
  }
}
```

#### TaskRunner

`import { TaskRunner } from 'react-redux-background-tasks'`

Responds to changes in the task queues and dispatches tasks on the given interval. This component must be placed as a child of the `TaskContext`.

```javascript
class MyApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: {}
    };
  }

  render() {
    return (
      <TaskContext.Provider value={{
        getTasks: getTasks.bind(this),
        updateTasks: updateTasks.bind(this)
      }}>
        <TaskRunner/>
        // Your app
      </TaskContext.Provider>
    );
  }
}
```

#### TaskCreator

`import { TaskCreator } from 'react-redux-background-tasks'`

HOC that wraps a regular component in a `TaskContext.Consumer`. Use the methods provided by `TaskContext` to cleanly pass in accessor methods as props to your `TaskCreators`.

```javascript
const MyTaskCreator = TaskCreator(MyComponent);
class MyApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: {},
    };
    this.getTasks = getTasks.bind(this);
    this.updateTasks = updateTasks.bind(this);
  }

  render() {
    return (
      <TaskContext.Provider value={{
        getTasks: this.getTasks,
        updateTasks: this.updateTasks
      }}>
        <MyTaskCreator/>
        // Your app
      </TaskContext.Provider>
    );
  }
}
```

#### TaskCreator

`import { TaskCreator } from 'react-redux-background-tasks'`

HOC that wraps a regular component in a `TaskContext.Consumer`. Use the methods provided by `TaskContext` to cleanly pass in accessor methods to your `TaskCreators`.

```javascript
// MyComponent gets access to getTasks and updateTasks to read/write on context
const MyTaskCreator = TaskCreator(MyComponent);
class MyApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: {},
    };
    this.getTasks = getTasks.bind(this);
    this.updateTasks = updateTasks.bind(this);
  }

  render() {
    return (
      <TaskContext.Provider value={{
        getTasks: this.getTasks,
        updateTasks: this.updateTasks
      }}>
        <MyTaskCreator/>
        // Your app
      </TaskContext.Provider>
    );
  }
}
```

#### TasksHelper

`import { TasksHelper } from 'react-redux-background-tasks'`

Exposes a static method `newTask` that properly formats a task object, giving it a random id.

```javascript
const callbackFn = () => true;
const interval = 1000;
const startOnLoad = true;
TasksHelper.newTask(callackFn, intervalMs, shouldStartOnLoad);
```
returns
```javascript
{
  callback: callackFn,
  interval: 1000,
  startOnLoad: true,
  id: 'a-random-uuid'
}
```


You can also pass in your own id as the fourth argument, in which case that will be used instead of the uuid.

```javascript
const callbackFn = () => true;
const interval = 1000;
const startOnLoad = true;
const myExistingId = 'a-random-id-123';
TasksHelper.newTask(callackFn, intervalMs, shouldStartOnLoad, myExistingId);
```
returns
```javascript
{
  callback: callackFn,
  interval: 1000,
  startOnLoad: true,
  id: 'a-random-id-123'
}
```

#### Redux Actions

Each action adds/removes from the task queues in the redux store. Each is also a thunk, allowing for asynchronous processing of tasks.

##### createTask

Should be dispatched to add the task id to the `created` queue

```javascript
import { createTask } from 'react-redux-background-tasks'

dispatch( createTask(myNewTaskId) );
```

##### editTask

Should be dispatched to add the task id to the `edited` queue

```javascript
import { editTask } from 'react-redux-background-tasks'

dispatch( editTask(myExistingEditedTaskId) );
```

##### deleteTask

Should be dispatched to add the task id to the `deleted` queue

```javascript
import { deleteTask } from 'react-redux-background-tasks'

dispatch( deleteTask(myExistingTaskIdToBeDeleted) );
```

##### processCreated

Should be dispatched to indicate a new task has been consumed, ie when it has been scheduled using `setInterval`. Pops a task id off the created queue.

```javascript
import { processCreated } from 'react-redux-background-tasks'

dispatch( processCreated(justScheduledTaskId) );
```

##### processEdited

Should be dispatched to indicate an edited task has been consumed, ie when it has been cancelled, edited, and rescheduled using `setInterval`. Pops a task id off the edited queue.

```javascript
import { processEdited } from 'react-redux-background-tasks'

dispatch( processEdited(justReScheduledTaskId) );
```

##### processDeleted

Should be dispatched to indicate an deleted task has been consumed, ie when it has been cancelled using `clearInterval`. Pops a task id off the deleted queue.

```javascript
import { processDeleted } from 'react-redux-background-tasks'

dispatch( processDeleted(justCancelledTaskId) );
```

#### Redux Reducer

A single reducer is provided that processes all the above actions.

```javascript
import { taskReducer } from 'react-redux-background-tasks'

const rootReducer = combineReducers({
  taskQueues: taskReducer
});
```
