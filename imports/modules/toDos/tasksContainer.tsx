import React from 'react';
import { IDefaultContainerProps } from '../../typings/BoilerplateDefaultTypings';
import { useParams, useLocation } from 'react-router-dom';
import TasksCreateController from './pages/tasksCreate/tasksCreateController';
import TasksEditController from './pages/tasksEdit/tasksEditController';
import TasksListController from './pages/tasksList/tasksListController';

export interface ITasksModuleContext {
    state?: string;
    id?: string;
}

export const TasksModuleContext = React.createContext<ITasksModuleContext>({});

const TasksContainer = (props: IDefaultContainerProps) => {
    const { taskId } = useParams();
    const location = useLocation();
    const state = location.pathname.split('/')[2] ?? props.screenState;
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