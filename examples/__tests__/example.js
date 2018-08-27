"use strict";

/*
 * Integration test of the task management process
 */

import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import App, {DApp} from '../example';

import rootReducer from '../../redux/reducers/tasks';
import TaskContext from '../../context/TaskContext';
import TaskCreator from '../../context/TaskCreator';
import TaskRunner from '../../components/TaskRunner';

describe('Task workflow', () => {

  // Lets us spy on dispatch calls to the redux store
  const rootReducerSpy = jest.fn((state, action) => rootReducer(state, action));

  let store;
  let app;

  beforeEach(() => {
    rootReducerSpy.mockClear();
    store = createStore(
      combineReducers({
        taskQueues: rootReducerSpy
      }),
      applyMiddleware(thunk)
    );
    app = mount(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });

  describe('Task create', () => {

    it(`should create a new task in the context and dispatch TASK_CREATED`, () => {
      // Ensure store task queues are empty
      expect(store.getState()).toStrictEqual({
        taskQueues: {
          created: [],
          edited: [],
          deleted: []
        }
      });

      expect(app.find(App).find("App").instance().state.myTaskId).toBe(false);
      app.find("div.create-task button").simulate('click');

      const id = app.find(App).find("App").instance().state.myTaskId;
      const tasksList = app.find(App).find("App").instance().state.tasks;
      expect(id).not.toBe(false);
      expect(rootReducerSpy).toHaveBeenCalledWith(expect.anything(), {
        type: 'TASK_CREATED',
        id
      });
      expect(tasksList).toStrictEqual({
        [id]: {
          callback: expect.any(Function),
          interval: 1000,
          startOnLoad: false
        }
      });
    });

  });

  describe('Task edit', () => {

    it(`should edit an existing task in the context and dispatch TASK_EDITED`, () => {
      // Ensure store task queues are empty
      expect(store.getState()).toStrictEqual({
        taskQueues: {
          created: [],
          edited: [],
          deleted: []
        }
      });
      expect(app.find(App).find("App").instance().state.myTaskId).toBe(false);
      app.find("div.create-task button").simulate('click'); // Create the task first
      const id = app.find(App).find("App").instance().state.myTaskId;

      app.find("div.edit-task button").simulate('click'); // Edit the task

      const tasksList = app.find(App).find("App").instance().state.tasks;
      expect(rootReducerSpy).toHaveBeenCalledWith(expect.anything(), {
        type: 'TASK_EDITED',
        id
      });
      expect(tasksList).toStrictEqual({
        [id]: {
          callback: expect.any(Function),
          interval: 2000, // Should have changed
          startOnLoad: true // Should have changed
        }
      });
    });

  });

  describe('Task delete', () => {

    it(`should delete an existing task in the context and dispatch TASK_DELETED`, () => {
      // Ensure store task queues are empty
      expect(store.getState()).toStrictEqual({
        taskQueues: {
          created: [],
          edited: [],
          deleted: []
        }
      });
      expect(app.find(App).find("App").instance().state.myTaskId).toBe(false);
      app.find("div.create-task button").simulate('click'); // Create the task first
      const id = app.find(App).find("App").instance().state.myTaskId;

      app.find("div.delete-task button").simulate('click'); // Delete the task

      expect(app.find(App).find("App").instance().state.myTaskId).toBe(false);
      const tasksList = app.find(App).find("App").instance().state.tasks;
      expect(rootReducerSpy).toHaveBeenCalledWith(expect.anything(), {
        type: 'TASK_DELETED',
        id
      });
      // expect(tasksList).toStrictEqual({});
    });

  });

});
