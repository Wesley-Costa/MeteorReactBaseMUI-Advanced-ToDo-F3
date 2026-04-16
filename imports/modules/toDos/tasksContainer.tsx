import React from 'react';
import { IDefaultContainerProps } from '../../typings/BoilerplateDefaultTypings';
import { useParams } from 'react-router-dom';
import TasksCreateController from './pages/tasksCreate/tasksCreateController';
import TasksEditController from './pages/tasksEdit/tasksEditController';
import TasksListController from './pages/tasksList/tasksListController';

export interface ITasksModuleContext {
    state?: string;
    id?: string;
}

export const TasksModuleContext = React.createContext<ITasksModuleContext>({});

const TasksContainer = (props: IDefaultContainerProps) => {
    const { screenState, taskId } = useParams();

    const state = screenState ?? props.screenState;
    const id = taskId ?? props.id;

    const renderPage = () => {
        if (state === 'create') return <TasksCreateController />;
        if (state === 'edit') return <TasksEditController />;
        return <TasksListController />;
    };

    return (
        <TasksModuleContext.Provider value={{ state, id }}>
            {renderPage()}
        </TasksModuleContext.Provider>
    );
};

export default TasksContainer;