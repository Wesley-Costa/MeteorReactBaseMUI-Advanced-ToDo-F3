import React, { createContext, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';
import { TasksModuleContext } from '../../tasksContainer';
import { tasksApi } from '../../api/tasksApi';
import { ITask } from '../../api/tasksSch';
import { ISchema } from '../../../../typings/ISchema';
import { IMeteorError } from '../../../../typings/BoilerplateDefaultTypings';
import TasksEditView from './tasksEditView';

interface ITasksEditControllerContext {
	closePage: () => void;
	document: ITask;
	loading: boolean;
	schema: ISchema<ITask>;
	onSubmit: (doc: ITask) => void;
}

export const TasksEditControllerContext = createContext<ITasksEditControllerContext>(
	{} as ITasksEditControllerContext
);

const TasksEditController = () => {
	const navigate = useNavigate();
	const { id } = useContext(TasksModuleContext);
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);

	const { document, loading } = useTracker(() => {
		const subHandle = id ? tasksApi.subscribe('edit', { _id: id }) : null;
		const document = id && subHandle?.ready() ? tasksApi.findOne({ _id: id }) : {};
		return {
			document: (document as ITask) ?? ({ _id: id } as ITask),
			loading: !!subHandle && !subHandle?.ready()
		};
	}, [id]);

	const closePage = useCallback(() => {
		navigate(-1);
	}, [navigate]);

	const onSubmit = useCallback(
		(doc: ITask) => {
			const updatedDoc: ITask = {
				...doc,
				updatedAt: new Date()
			};

			tasksApi.update(updatedDoc, (e: IMeteorError) => {
				if (!e) {
					closePage();
					showNotification({
						type: 'success',
						title: 'Tarefa atualizada!',
						message: 'A tarefa foi atualizada com sucesso!',
						showCloseButton: true
					});
				} else {
					showNotification({
						type: 'error',
						title: 'Erro ao atualizar tarefa!',
						message: `Erro ao realizar a operação: ${e.reason}`,
						showCloseButton: true
					});
				}
			});
		},
		[closePage, showNotification]
	);

	return (
		<TasksEditControllerContext.Provider
			value={{
				closePage,
				document: { ...document, _id: id },
				loading,
				schema: tasksApi.getSchema(),
				onSubmit
			}}>
			<TasksEditView />
		</TasksEditControllerContext.Provider>
	);
};

export default TasksEditController;