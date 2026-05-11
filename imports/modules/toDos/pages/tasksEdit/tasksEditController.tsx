import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';
import { tasksApi } from '../../api/tasksApi';
import { ITask } from '../../api/tasksSch';
import { ISchema } from '../../../../typings/ISchema';
import { IMeteorError } from '../../../../typings/BoilerplateDefaultTypings';
import { IOption } from '../../../../ui/components/InterfaceBaseSimpleFormComponent';
import TasksEditView from './tasksEditView';
import { userprofileData } from '/imports/libs/getUser';

const STATUS_OPTIONS: IOption[] = [
	{ value: 'open', label: 'Pendente' },
	{ value: 'completed', label: 'Concluída' }
];

const statusValueToLabel: Record<string, string> = {
	open: 'Pendente',
	completed: 'Concluída'
};

const statusLabelToValue: Record<string, ITask['status']> = {
	Pendente: 'open',
	Concluída: 'completed'
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
	const location = useLocation();

	const id: string | undefined = (location.state as { taskId?: string } | null)?.taskId;

	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);

	const usernameToIdMapRef = useRef<Record<string, string>>({});
	const idToUsernameMapRef = useRef<Record<string, string>>({});

	const { document, loading, userOptions, noPermission } = useTracker(() => {
		const subHandle = id ? tasksApi.subscribe('edit', { _id: id }) : null;
		const subReady = subHandle?.ready() ?? false;
		const rawDocument = id && subReady ? tasksApi.findOne({ _id: id }) : undefined;

		const noPermission = !!id && subReady && !rawDocument;

		const usersSubHandle = Meteor.subscribe('userprofile.getListOfusers');
		const userprofileCollection = userprofileData.collectionInstance;
		const users = usersSubHandle.ready() ? userprofileCollection.find({}).fetch() : [];

		const userOptions: IOption[] = users.map((u: any) => ({
			value: u.username,
			label: u.username
		}));

		usernameToIdMapRef.current = {};
		idToUsernameMapRef.current = {};
		users.forEach((u: any) => {
			usernameToIdMapRef.current[u.username] = u._id;
			idToUsernameMapRef.current[u._id] = u.username;
		});

		const task = rawDocument as ITask | undefined;

		const assignedToDisplayName = task?.assignedTo
			? (idToUsernameMapRef.current[task.assignedTo] ?? task.assignedTo)
			: task?.assignedTo;

		const statusLabel = task?.status
			? (statusValueToLabel[task.status] ?? task.status)
			: task?.status;

		const document: ITask = task
			? { ...task, assignedTo: assignedToDisplayName, status: statusLabel as ITask['status'] }
			: ({ _id: id } as ITask);

		return {
			document,
			loading: (!!subHandle && !subReady) || !usersSubHandle.ready(),
			userOptions,
			noPermission
		};
	}, [id]);

	useEffect(() => {
		if (!id) {
			navigate('/tasks', { replace: true });
		}
	}, [id, navigate]);

	useEffect(() => {
		if (noPermission) {
			navigate('/no-permission', { replace: true });
		}
	}, [noPermission, navigate]);

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
				_id: id,
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
		[id, closePage, showNotification]
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