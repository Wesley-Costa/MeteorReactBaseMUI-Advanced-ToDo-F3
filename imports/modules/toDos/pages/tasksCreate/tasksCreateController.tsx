import React, { createContext, useCallback, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';
import { tasksApi } from '../../api/tasksApi';
import { ITask } from '../../api/tasksSch';
import { ISchema } from '../../../../typings/ISchema';
import { IMeteorError } from '../../../../typings/BoilerplateDefaultTypings';
import { IOption } from '../../../../ui/components/InterfaceBaseSimpleFormComponent';
import TasksCreateView from './tasksCreateView';
import { userprofileData } from '/imports/libs/getUser';

interface ITasksCreateControllerContext {
	closePage: () => void;
	document: ITask;
	loading: boolean;
	schema: ISchema<ITask>;
	onSubmit: (doc: ITask) => void;
	userOptions: IOption[];
}

export const TasksCreateControllerContext = createContext<ITasksCreateControllerContext>(
	{} as ITasksCreateControllerContext
);

const TasksCreateController = () => {
	const navigate = useNavigate();
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);

	const usernameToIdMapRef = useRef<Record<string, string>>({});

	const { userOptions, loading } = useTracker(() => {
		const subHandle = Meteor.subscribe('userprofile.getListOfusers');
		const userprofileCollection = userprofileData.collectionInstance;
		const users = subHandle.ready() ? userprofileCollection.find({}).fetch() : [];

		const options: IOption[] = users.map((u: any) => {
			const name = u.username;
			return { value: name, label: name };
		});

		usernameToIdMapRef.current = {};
		users.forEach((u: any) => {
			const name = u.username;
			usernameToIdMapRef.current[name] = u._id;
		});

		return { userOptions: options, loading: !subHandle.ready() };
	}, []);

	const closePage = useCallback(() => {
		navigate(-1);
	}, [navigate]);

	const onSubmit = useCallback(
		(doc: ITask) => {
			const user = Meteor.user();
			const now = new Date();

			const assignedToName = doc.assignedToName ?? '';
			const assignedToId = usernameToIdMapRef.current[assignedToName] ?? '';

			const enrichedDoc: ITask = {
				...doc,
				assignedTo: assignedToId,
				assignedToName,
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
						message: 'A tarefa foi cadastrada com sucesso!',
						showCloseButton: true
					});
				} else {
					showNotification({
						type: 'error',
						title: 'Erro ao criar tarefa!',
						message: `Erro ao realizar a operação: ${e.reason}`,
						showCloseButton: true
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
				loading: loading,
				schema: tasksApi.getSchema(),
				onSubmit,
				userOptions
			}}>
			<TasksCreateView />
		</TasksCreateControllerContext.Provider>
	);
};

export default TasksCreateController;
