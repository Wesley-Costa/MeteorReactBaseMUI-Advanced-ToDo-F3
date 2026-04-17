import { tasksRouterList } from './config/tasksRouters';
import { tasksMenuItemList } from './config/tasksAppMenu';
import { IModuleHub } from '../modulesTypings';

const Tasks: IModuleHub = {
	pagesRouterList: tasksRouterList,
	pagesMenuItemList: tasksMenuItemList
};

export default Tasks;