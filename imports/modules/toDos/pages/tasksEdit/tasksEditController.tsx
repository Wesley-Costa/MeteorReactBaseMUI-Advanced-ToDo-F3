import React, { createContext, useCallback, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';
import { TasksModuleContext } from '../../tasksContainer';
import { tasksApi } from '../../api/tasksApi';
import { ITask } from '../../api/tasksSch';
import { ISchema } from '../../../../typings/ISchema';
import { IMeteorError } from '../../../../typings/BoilerplateDefaultTypings';
import { IOption } from '../../../../ui/components/InterfaceBaseSimpleFormComponent';
import TasksEditView from './tasksEditView';
import { userprofileData } from '/imports/libs/getUser';

const STATUS_OPTIONS: IOption[] = [
	{ value: 'open', label: 'Não concluída' },
	{ value: 'completed', label: 'Concluída' }
];

const statusValueToLabel: Record<string, string> = {
	open: 'Não concluída',
	completed: 'Concluída'
};

const statusLabelToValue: Record<string, ITask['status']> = {
	'Não concluída': 'open',
	'Concluída': 'completed'
};

interface ITasksEditControllerContext {
	closePage: () => void;
	document: ITask;
	loading: boolean;
	schema: ISchema<ITask>;
	onSubmit: (doc: ITask) => void;
	userOptions: IOption[];
	statusOptions: IOption[];
}

export const TasksEditControllerContext = createContext<ITasksEditControllerContext>({} as ITasksEditControllerContext);

const TasksEditController = () => {
	const navigate = useNavigate();
	const { id } = useContext(TasksModuleContext);
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);

	const usernameToIdMapRef = useRef<Record<string, string>>({});
	const idToUsernameMapRef = useRef<Record<string, string>>({});

	const { document, loading, userOptions } = useTracker(() => {
		const subHandle = id ? tasksApi.subscribe('edit', { _id: id }) : null;
		const rawDocument = id && subHandle?.ready() ? tasksApi.findOne({ _id: id }) : {};

		const usersSubHandle = Meteor.subscribe('userprofile.getListOfusers');
		const userprofileCollection = userprofileData.collectionInstance;
		const users = usersSubHandle.ready() ? userprofileCollection.find({}).fetch() : [];

		const userOptions: IOption[] = users.map((u: any) => {
			const name = u.username || u.email?.[0]?.address || u._id;
			return { value: name, label: name };
		});

		usernameToIdMapRef.current = {};
		idToUsernameMapRef.current = {};
		users.forEach((u: any) => {
			const name = u.username;
			usernameToIdMapRef.current[name] = u._id;
			idToUsernameMapRef.current[u._id] = name;
		});

		const task = rawDocument as ITask;

		const assignedToDisplayName = task?.assignedTo
			? (idToUsernameMapRef.current[task.assignedTo] ?? task.assignedTo)
			: task?.assignedTo;

		const statusLabel = task?.status
			? (statusValueToLabel[task.status] ?? task.status)
			: task?.status;

		const document: ITask = {
			...task,
			assignedTo: assignedToDisplayName,
			status: statusLabel as ITask['status']
		};

		return {
			document: document ?? ({ _id: id } as ITask),
			loading: (!!subHandle && !subHandle?.ready()) || !usersSubHandle.ready(),
			userOptions
		};
	}, [id]);

	const closePage = useCallback(() => {
		navigate(-1);
	}, [navigate]);

	const onSubmit = useCallback(
		(doc: ITask) => {
			const assignedToName = doc.assignedTo ?? '';
			const assignedToId = usernameToIdMapRef.current[assignedToName] ?? '';

			const statusValue = statusLabelToValue[doc.status] ?? doc.status;

			const updatedDoc: ITask = {
				...doc,
				assignedTo: assignedToId,
				assignedToName,
				status: statusValue,
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
				onSubmit,
				userOptions,
				statusOptions: STATUS_OPTIONS
			}}>
			<TasksEditView />
		</TasksEditControllerContext.Provider>
	);
};

export default TasksEditController;