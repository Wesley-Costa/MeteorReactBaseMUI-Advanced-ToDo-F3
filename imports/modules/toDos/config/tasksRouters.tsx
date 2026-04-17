import TasksContainer from '../tasksContainer';
import { Recurso } from './recursos';
import { IRoute } from '../../modulesTypings';

export const tasksRouterList: (IRoute | null)[] = [
	{
		path: '/tasks/:screenState/:taskId',
		component: TasksContainer,
		isProtected: true,
		resources: [Recurso.TASKS_VIEW]
	},
	{
		path: '/tasks/:screenState',
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