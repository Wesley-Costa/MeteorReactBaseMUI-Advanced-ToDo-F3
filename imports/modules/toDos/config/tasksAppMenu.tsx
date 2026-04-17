import React from 'react';
import SysIcon from '../../../ui/components/sysIcon/sysIcon';
import { IAppMenu } from '../../modulesTypings';
import { Recurso } from './recursos';

export const tasksMenuItemList: (IAppMenu | null)[] = [
	{
		path: '/tasks',
		name: 'Tarefas',
		icon: <SysIcon name={'task'} />,
		resources: [Recurso.TASKS_VIEW]
	}
];