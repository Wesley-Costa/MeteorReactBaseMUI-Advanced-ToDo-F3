import React, { useCallback, useMemo, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';
import { tasksApi } from '../../api/tasksApi';
import { ITask } from '../../api/tasksSch';
import { IMeteorError } from '../../../../typings/IMeteorError';
import TasksListView from './tasksListView';

interface ITasksListControllerContext {
	tasks: ITask[];
	loading: boolean;
	actionLoadingId: string | null;
	onAddTaskClick: () => void;
	onTaskClick: (id: string) => void;
	onDeleteTask: (task: ITask) => void;
	onTaskCheckboxClick: (e: React.MouseEvent, id: string) => void;
}

export const TasksListControllerContext = React.createContext<ITasksListControllerContext>(
	{} as ITasksListControllerContext
);

const TasksListController = () => {
	const navigate = useNavigate();
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);
	const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

	const { loading, tasks } = useTracker(() => {
		const subHandle = tasksApi.subscribe('list');
		const isReady = !!subHandle && subHandle.ready();
		return {
			loading: !isReady,
			tasks: isReady ? tasksApi.find({}).fetch() : []
		};
	}, []);

	const onAddTaskClick = useCallback(() => {
		navigate('/tasks/create');
	}, [navigate]);

	const onTaskClick = useCallback(
		(id: string) => {
			navigate(`/tasks/edit/${id}`);
		},
		[navigate]
	);

	const onDeleteTask = useCallback(
		(task: ITask) => {
			if (!task?._id) return;
			if (task.createdBy && task.createdBy !== Meteor.userId()) {
				showNotification({
					type: 'error',
					title: 'Permissão negada',
					message: 'Somente o criador pode remover esta tarefa.',
					showCloseButton: true
				});
				return;
			}
			setActionLoadingId(task._id);
			tasksApi.remove({ _id: task._id }, (e: IMeteorError, r: any) => {
				setActionLoadingId(null);
				if (e) {
					showNotification({
						type: 'error',
						title: 'Erro ao excluir',
						message: e.reason || 'Falha ao excluir a tarefa',
						showCloseButton: true
					});
					return;
				}
				showNotification({
					type: 'success',
					title: 'Tarefa excluída',
					message: (r && (r.message || r.reason)) || 'Tarefa removida com sucesso'
				});
			});
		},
		[showNotification]
	);

	const onTaskCheckboxClick = useCallback(
		(e: React.MouseEvent, id: string) => {
			e.stopPropagation();
			const task = tasks.find((t) => t._id === id);
			if (!task) return;

			const newStatus = task.status === 'completed' ? 'open' : 'completed';
			setActionLoadingId(id);
			tasksApi.update({ ...task, status: newStatus }, (e: IMeteorError) => {
				setActionLoadingId(null);
				if (e) {
					showNotification({
						type: 'error',
						title: 'Erro ao atualizar',
						message: e.reason || 'Falha ao atualizar a tarefa',
						showCloseButton: true
					});
				}
			});
		},
		[tasks, showNotification]
	);

	const providerValues: ITasksListControllerContext = useMemo(
		() => ({
			tasks,
			loading,
			actionLoadingId,
			onAddTaskClick,
			onTaskClick,
			onDeleteTask,
			onTaskCheckboxClick
		}),
		[tasks, loading, actionLoadingId, onAddTaskClick, onTaskClick, onDeleteTask, onTaskCheckboxClick]
	);

	return (
		<TasksListControllerContext.Provider value={providerValues}>
			<TasksListView />
		</TasksListControllerContext.Provider>
	);
};

export default TasksListController;