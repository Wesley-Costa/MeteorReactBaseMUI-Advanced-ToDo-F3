import { IAppMenu, IModuleHub, IRoute } from './modulesTypings';
import UserProfile from './userprofile/config';
import Tasks from './toDos';

const pages: Array<IRoute | null> = [
	...UserProfile.pagesRouterList,
	...Tasks.pagesRouterList,
];

const menuItens: Array<IAppMenu | null> = [
	...UserProfile.pagesMenuItemList,
 	...Tasks.pagesMenuItemList,
];

const Modules: IModuleHub = {
	pagesMenuItemList: menuItens,
	pagesRouterList: pages
};

export default Modules;
