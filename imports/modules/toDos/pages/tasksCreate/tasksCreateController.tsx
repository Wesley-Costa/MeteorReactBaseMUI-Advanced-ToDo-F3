import React, { createContext, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';
import { tasksApi } from '../../api/tasksApi';
import { ITask } from '../../api/tasksSch';
import { ISchema } from '../../../../typings/ISchema';
import { IMeteorError } from '../../../../typings/BoilerplateDefaultTypings';
import TasksCreateView from './tasksCreateView';

interface ITasksCreateControllerContext {
	closePage: () => void;
	document: ITask;
	loading: boolean;
	schema: ISchema<ITask>;
	onSubmit: (doc: ITask) => void;
}

export const TasksCreateControllerContext = createContext<ITasksCreateControllerContext>(
	{} as ITasksCreateControllerContext
);

const TasksCreateController = () => {
	const navigate = useNavigate();
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);

	const closePage = useCallback(() => {
		navigate(-1);
	}, [navigate]);

	const onSubmit = useCallback(
		(doc: ITask) => {
			const user = Meteor.user();
			const now = new Date();
			const enrichedDoc: ITask = {
				...doc,
				createdBy: Meteor.userId() ?? '',
				authorName: user?.username ?? '',
				createdAt: now,
				updatedAt: now
			};

			tasksApi.insert(enrichedDoc, (e: IMeteorError) => {
				if (!e) {
					closePage();
					showNotification({
						type: 'success',
						title: 'Tarefa criada!',
						message: 'A tarefa foi cadastrada com sucesso!'
					});
				} else {
					showNotification({
						type: 'error',
						title: 'Erro ao criar tarefa!',
						message: `Erro ao realizar a operação: ${e.reason}`
					});
				}
			});
		},
		[closePage, showNotification]
	);

	return (
		<TasksCreateControllerContext.Provider
			value={{
				closePage,
				document: {} as ITask,
				loading: false,
				schema: tasksApi.getSchema(),
				onSubmit
			}}>
			<TasksCreateView />
		</TasksCreateControllerContext.Provider>
	);
};

export default TasksCreateController;