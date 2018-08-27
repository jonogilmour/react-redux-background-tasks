import React from 'react';
import TaskContext from '../../TaskContext';
import { TaskCreator } from '../../TaskCreator';

const taskContextValue = {
  tasks: {
    abc: 123,
    cde: 'task'
  },
  updateTasks: (tasks) => {
    this.tasks = {...this.tasks, tasks}
  }
}
const SampleConsumer = () => <div>abc</div>;

const TaskConsumerComponent = TaskCreator(SampleConsumer);

const SampleContext = () => (
  <TaskConsumerComponent/>
);

describe('TaskContext with a TaskCreator child', () => {

  it(`should render`, () => {
    const sC = shallow(<SampleContext/>);
    expect(sC.find(TaskConsumerComponent).length).toBe(1);
  });

  it(`should pass context.tasks to consumer`, () => {
    const sC = mount(<TaskConsumerComponent/>);
    expect(sC.find(SampleConsumer).length).toBe(1);
  });

});
