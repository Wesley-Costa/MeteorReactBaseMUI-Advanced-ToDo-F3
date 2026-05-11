import React, { useCallback, useContext, useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';
import { tasksApi } from '../../api/tasksApi';
import { ITask } from '../../api/tasksSch';
import { IMeteorError } from '../../../../typings/IMeteorError';
import TasksListView from './tasksListView';

interface ITasksListControllerContext {
	openTasks: ITask[];
	completedTasks: ITask[];
	loading: boolean;
	actionLoadingId: string | null;
	searchText: string;
	openPage: number;
	completedPage: number;
	hasNextOpen: boolean;
	hasNextCompleted: boolean;
	onOpenPageChange: (page: number) => void;
	onCompletedPageChange: (page: number) => void;
	onSearchChange: (value: string) => void;
	onAddTaskClick: () => void;
	onTaskClick: (id: string) => void;
	onDeleteTask: (task: ITask) => void;
	onTaskCheckboxClick: (e: React.MouseEvent, id: string) => void;
	resolveAssignedLabel: (task: ITask) => string;
	resolveAuthorLabel: (task: ITask) => string;
	permissions: Record<string, boolean>;
}

export const TasksListControllerContext = React.createContext<ITasksListControllerContext>(
	{} as ITasksListControllerContext
);

const PAGE_SIZE = 4;

const TasksListController = () => {
	const navigate = useNavigate();
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);
	const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
	const [searchText, setSearchText] = useState<string>('');
	const [openPage, setOpenPage] = useState(1);
	const [completedPage, setCompletedPage] = useState(1);
	const [permissions, setPermissions] = useState<Record<string, boolean>>({});

	const handleSearchChange = useCallback((value: string) => {
		setSearchText(value);
		setOpenPage(1);
		setCompletedPage(1);
	}, []);

	const { loading, openTasks, completedTasks, hasNextOpen, hasNextCompleted } = useTracker(() => {
		const openSub = tasksApi.subscribe(
			'list',
			searchText,
			{ status: 'open' },
			{ skip: (openPage - 1) * PAGE_SIZE, limit: PAGE_SIZE + 1 }
		);

		const completedSub = tasksApi.subscribe(
			'list',
			searchText,
			{ status: 'completed' },
			{ skip: (completedPage - 1) * PAGE_SIZE, limit: PAGE_SIZE + 1 }
		);

		Meteor.subscribe('userprofile.getListOfusers');

		const isReady = !!openSub && openSub.ready() && !!completedSub && completedSub.ready();

		if (!isReady) {
			return { loading: true, openTasks: [], completedTasks: [], hasNextOpen: false, hasNextCompleted: false };
		}

		const rawOpen = tasksApi.findByStatus('open', PAGE_SIZE + 1);
		const rawCompleted = tasksApi.findByStatus('completed', PAGE_SIZE + 1);

		return {
			loading: false,
			openTasks: rawOpen.slice(0, PAGE_SIZE),
			completedTasks: rawCompleted.slice(0, PAGE_SIZE),
			hasNextOpen: rawOpen.length > PAGE_SIZE,
			hasNextCompleted: rawCompleted.length > PAGE_SIZE
		};
	}, [searchText, openPage, completedPage]);


	const allTasks = useMemo(() => [...openTasks, ...completedTasks], [openTasks, completedTasks]);

	const allTaskIds = useMemo(
		() => allTasks.map((t) => t._id).filter(Boolean).join(','),
		[allTasks]
	);

	useEffect(() => {
		let cancelled = false;

		if (allTasks.length === 0) {
			setPermissions({});
			return;
		}

		const validTasks = allTasks.filter((t): t is ITask & { _id: string } => !!t._id);

		Promise.all(
			validTasks.map(async (task) => {
				const canAct = await tasksApi.canActOnTask(task._id);
				return [task._id, canAct] as const;
			})
		).then((entries) => {
			if (!cancelled) setPermissions(Object.fromEntries(entries));
		}).catch(() => {
			if (!cancelled) setPermissions({});
		});

		return () => { cancelled = true; };
	}, [allTaskIds]);

	const onOpenPageChange = useCallback((page: number) => setOpenPage(Math.max(1, page)), []);
	const onCompletedPageChange = useCallback((page: number) => setCompletedPage(Math.max(1, page)), []);
	const onAddTaskClick = useCallback(() => navigate('/tasks/create'), [navigate]);
	const onTaskClick = useCallback((id: string) => navigate('/tasks/edit', { state: { taskId: id } }), [navigate]);

	const resolveAssignedLabel = useCallback((task: ITask): string => {
		if (!task.assignedTo && !task.assignedToName) return 'Não atribuída';
		if (task.assignedTo === Meteor.userId()) return 'Você';
		return task.assignedToName || 'Desconhecido';
	}, []);

	const resolveAuthorLabel = useCallback((task: ITask): string => {
		if (task.createdBy === Meteor.userId()) return 'Você';
		return task.authorName || 'Desconhecido';
	}, []);

	const onDeleteTask = useCallback(
		(task: ITask) => {
			if (!task?._id) return;

			if (!permissions[task._id]) {
				showNotification({
					type: 'error',
					title: 'Permissão negada',
					message: 'Somente o criador ou administrador pode remover esta tarefa.',
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
					message: (r && (r.message || r.reason)) || 'Tarefa removida com sucesso',
					showCloseButton: true
				});
			});
		},
		[permissions, showNotification]
	);

	const tasks = useMemo(() => [...openTasks, ...completedTasks], [openTasks, completedTasks]);

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
			openTasks,
			completedTasks,
			loading,
			actionLoadingId,
			searchText,
			openPage,
			completedPage,
			hasNextOpen,
			hasNextCompleted,
			onOpenPageChange,
			onCompletedPageChange,
			onSearchChange: handleSearchChange,
			onAddTaskClick,
			onTaskClick,
			onDeleteTask,
			onTaskCheckboxClick,
			resolveAssignedLabel,
			resolveAuthorLabel,
			permissions
		}),
		[
			openTasks,
			completedTasks,
			loading,
			actionLoadingId,
			searchText,
			openPage,
			completedPage,
			hasNextOpen,
			hasNextCompleted,
			onOpenPageChange,
			onCompletedPageChange,
			handleSearchChange,
			onAddTaskClick,
			onTaskClick,
			onDeleteTask,
			onTaskCheckboxClick,
			resolveAssignedLabel,
			resolveAuthorLabel,
			permissions
		]
	);

	return (
		<TasksListControllerContext.Provider value={providerValues}>
			<TasksListView />
		</TasksListControllerContext.Provider>
	);
};

export default TasksListController;