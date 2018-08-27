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

Relies on **Redux**, and the **React Context API**, so React v16+ is required.

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

    // Automatically returns this.state.tasks
    this.getTasks = getTasks.bind(this);
    // Updates the contents of this.state.tasks
    this.updateTasks = updateTasks.bind(this);
  }

  render() {
    return (
      <TaskContext.Provider value={this.state.tasks}>
        // Your app
      </TaskContext.Provider>
    );
  }
}
```

#### TaskRunner

`import { TaskRunner } from 'react-redux-background-tasks'`

Responds to changes in the task queues and dispatches tasks on the given interval. This component must be placed as a child of the `TaskContext` and be given accessor methods to the task state.

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
      <TaskContext.Provider value={this.state.tasks}>
        <TaskRunner getTasks={ () => this.state.tasks } updateTasks={ tasks => this.setState({ tasks }) }/>
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
      <TaskContext.Provider value={this.state.tasks}>
        <MyTaskCreator getTasks={this.getTasks} updateTasks={this.updateTasks}/>
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
      <TaskContext.Provider value={this.state.tasks}>
        <MyTaskCreator getTasks={this.getTasks} updateTasks={this.updateTasks}/>
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
