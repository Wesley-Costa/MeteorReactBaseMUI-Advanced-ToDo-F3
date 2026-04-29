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

const STATUS_OPTIONS: IOption[] = [
	{ value: 'Não concluída', label: 'Não concluída' },
	{ value: 'Concluída', label: 'Concluída' }
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

	const { document, loading, userOptions } = useTracker(() => {
		const subHandle = id ? tasksApi.subscribe('edit', { _id: id }) : null;
		const rawDocument = id && subHandle?.ready() ? tasksApi.findOne({ _id: id }) : {};

		const usersSubHandle = Meteor.subscribe('userprofile.getListOfusers');
		const users = usersSubHandle.ready()
			? Meteor.users.find({}, { fields: { _id: 1, username: 1, 'emails.address': 1 } }).fetch()
			: [];

		const userOptions: IOption[] = users.map((u) => {
			const name = u.username || u.emails?.[0]?.address || u._id;
			return { value: name, label: name };
		});

		const idToUsernameMap: Record<string, string> = {};
		usernameToIdMapRef.current = {};
		users.forEach((u) => {
			const name = u.username || u.emails?.[0]?.address || u._id;
			idToUsernameMap[u._id] = name;
			usernameToIdMapRef.current[name] = u._id;
		});

		const task = rawDocument as ITask;

		const assignedToUsername = task?.assignedTo
			? (idToUsernameMap[task.assignedTo] ?? task.assignedTo)
			: task?.assignedTo;

		const statusLabel = task?.status ? (statusValueToLabel[task.status] ?? task.status) : task?.status;

		const document: ITask = {
			...task,
			assignedTo: assignedToUsername,
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
