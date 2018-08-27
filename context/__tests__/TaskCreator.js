import React from 'react';
import { TaskCreator } from '../TaskCreator';
import TaskContext, { updateTasks as tcUpdateTasks, getTasks as tcGetTasks } from '../TaskContext';

jest.mock('../TaskContext');

const SampleComponent = () => <div>abcdefg</div>;

const TaskCreatorComponent = TaskCreator(props => <SampleComponent {...props}/>);

describe('TaskCreator', () => {

  it(`should return a TaskContext Consumer`, () => {
    const tCC = shallow(<TaskCreatorComponent/>);
    expect(tCC.find(TaskContext.Consumer).length).toBe(1);
  });

  it(`should render the component`, () => {
    const tCC = mount(<TaskCreatorComponent/>);
    expect(tCC.find(SampleComponent).length).toBe(1);
  });

  it(`should give access to the context properties 'getTasks' and 'updateTasks'`, () => {
    const tCC = mount(<TaskCreatorComponent/>);

    expect(tCC.find(SampleComponent).prop('getTasks')).not.toBeUndefined();
    expect(tCC.find(SampleComponent).prop('updateTasks')).not.toBeUndefined();

    expect(tCC.find(SampleComponent).prop('getTasks')).toBe(tcGetTasks);
    expect(tCC.find(SampleComponent).prop('updateTasks')).toBe(tcUpdateTasks);
  });

});
