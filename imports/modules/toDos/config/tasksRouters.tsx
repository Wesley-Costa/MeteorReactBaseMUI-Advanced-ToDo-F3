import TasksContainer from '../tasksContainer';
import { Recurso } from './recursos';
import { IRoute } from '../../modulesTypings';

export const tasksRouterList: (IRoute | null)[] = [
    {
        path: '/tasks/edit',
        component: TasksContainer,
        isProtected: true,
        resources: [Recurso.TASKS_UPDATE]
    },
    {
        path: '/tasks/create',
        component: TasksContainer,
        isProtected: true,
        resources: [Recurso.TASKS_CREATE]
    },
    {
        path: '/tasks',
        component: TasksContainer,
        isProtected: true,
        resources: [Recurso.TASKS_VIEW]
    }
];