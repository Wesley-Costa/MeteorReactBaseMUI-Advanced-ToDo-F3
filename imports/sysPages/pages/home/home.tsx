import React, { useCallback, useContext, useState, Fragment } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import { Typography, List, Divider, DialogTitle, DialogContent, ListItemText, Tooltip } from '@mui/material';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';
import { tasksApi } from '/imports/modules/toDos/api/tasksApi';
import { ITask } from '/imports/modules/toDos/api/tasksSch';
import HomeStyles from './homeStyle';
import SysIcon from '/imports/ui/components/sysIcon/sysIcon';
import { SysLoading } from '/imports/ui/components/sysLoading/sysLoading';
import { SysButton } from '/imports/ui/components/SimpleFormFields/SysButton/SysButton';

const {
	Container, Header, HeaderTitle, HeaderSubtitle, SectionWrapper, SectionLabel, SectionLabelTitle, ListContainer,
	RemainingListContainer, TaskListItem, TaskListItemIcon, TaskListItemButton, TaskSecondaryStack, TaskTitle, TaskCreatorText,
	TaskCreatorUnderline, TaskCheckbox, TaskActions, ActionButton, StateContainer, TaskModal, TaskModalHeader, TaskModalTitleRow,
	TaskModalTitle, TaskModalStatusChip, TaskModalMeta, TaskModalSection, TaskModalSectionLabel, TaskModalDescriptionBody,
	TaskModalDescriptionText, TaskModalInfoRow, TaskModalInfoLabel, TaskModalInfoAvatar, TaskModalInfoValue, TaskModalActions,
	FooterSection, GoToTasksButton, GoToTasksIcon
} = HomeStyles;

const resolveCreatorLabel = (taskCreatedBy?: string, taskAuthorName?: string): string =>
	taskCreatedBy === Meteor.userId() ? 'Você' : taskAuthorName || '';

const resolveAssignedLabel = (task: ITask): string => {
	if (!task.assignedTo) return '';
	if (task.assignedTo === Meteor.userId()) return 'Você';
	return task.assignedToName || '';
};

const getInitials = (name?: string): string => {
	if (!name) return '?';
	const parts = name.trim().split(' ').filter(Boolean);
	return parts.length >= 2
		? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
		: name.slice(0, 2).toUpperCase();
};

const formatDate = (date?: Date): string => {
	if (!date) return '—';
	return new Date(date).toLocaleString('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
};

const HomePage: React.FC = () => {
	const navigate = useNavigate();
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);

	const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

	const currentUser = useTracker(() => Meteor.user(), []);
	const firstName = (() => {
		const username = currentUser?.username || 'Usuário';
		return username.split(' ')[0] || username;
	})();

	const { loading, recentTasks } = useTracker<{ loading: boolean; recentTasks: ITask[] }>(() => {
		const subHandle = tasksApi.subscribe('recent');
		const isReady = !!subHandle && subHandle.ready();
		return {
			loading: !isReady,
			recentTasks: isReady ? tasksApi.find({}).fetch() : []
		};
	}, []);

	const mostRecentTask = recentTasks[0] ?? null;
	const remainingTasks = recentTasks.slice(1);

	const handleOpenTask = (task: ITask) => {
		setSelectedTask(task);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedTask(null);
	};

	const handleGoToTasks = () => navigate('/tasks');

	const handleEditTask = useCallback(
		(task: ITask) => {
			if (!task?._id) return;
			if (!tasksApi.isOwnerOrAdmin(task)) {
				showNotification({
					type: 'error',
					title: 'Permissão negada',
					message: 'Somente o criador ou administrador pode editar esta tarefa.'
				});
				return;
			}
			navigate('/tasks/edit', { state: { taskId: task._id } });
		},
		[navigate, showNotification]
	);

	const handleDeleteTask = useCallback(
		(task: ITask) => {
			if (!task?._id) return;
			if (!tasksApi.isOwnerOrAdmin(task)) {
				showNotification({
					type: 'error',
					title: 'Permissão negada',
					message: 'Somente o criador ou administrador pode remover esta tarefa.'
				});
				return;
			}
			if (selectedTask?._id === task._id) {
				setIsModalOpen(false);
				setSelectedTask(null);
			}
			setActionLoadingId(task._id!);
			tasksApi.remove({ _id: task._id }, (e: Meteor.Error) => {
				setActionLoadingId(null);
				if (e) {
					showNotification({
						type: 'error',
						title: 'Erro ao excluir',
						message: e.reason || 'Falha ao excluir a tarefa'
					});
					return;
				}
				showNotification({ type: 'success', title: 'Tarefa excluída', message: 'Tarefa removida com sucesso' });
			});
		},
		[selectedTask, showNotification]
	);

	const handleToggleTaskStatus = useCallback(
		(task: ITask) => {
			if (!task?._id) return;
			const newStatus = task.status === 'completed' ? 'open' : 'completed';
			setActionLoadingId(task._id!);
			tasksApi.update({ ...task, status: newStatus }, (e: Meteor.Error | undefined) => {
				setActionLoadingId(null);
				if (e) {
					showNotification({
						type: 'error',
						title: 'Erro ao atualizar',
						message: e.reason || 'Falha ao atualizar a tarefa',
						showCloseButton: true
					});
					return;
				}
				showNotification({
					type: 'success',
					title: 'Tarefa atualizada',
					message: 'Status atualizado com sucesso',
					showCloseButton: true
				});
			});
		},
		[showNotification]
	);

	const renderTaskActions = (task: ITask, isLoading: boolean) => (
		<TaskActions>
			<Tooltip title="Editar">
				<span>
					<ActionButton
						size="small"
						disabled={isLoading}
						onClick={(e) => {
							e.stopPropagation();
							handleEditTask(task);
						}}>
						<SysIcon name="edit" />
					</ActionButton>
				</span>
			</Tooltip>

			<Tooltip title="Excluir">
				<span>
					<ActionButton
						size="small"
						disabled={isLoading}
						onClick={(e) => {
							e.stopPropagation();
							handleDeleteTask(task);
						}}>
						<SysIcon name="delete" />
					</ActionButton>
				</span>
			</Tooltip>
		</TaskActions>
	);

	const renderTaskItem = (task: ITask, idx: number) => {
		const isCompleted = task.status === 'completed';
		const isLoading = actionLoadingId === task._id;

		return (
			<Fragment key={task._id || idx}>
				<TaskListItem
					secondaryAction={tasksApi.isOwnerOrAdmin(task) ? renderTaskActions(task, isLoading) : undefined}
					disablePadding>
					<TaskListItemIcon>
						<TaskCheckbox
							completed={isCompleted}
							onClick={(e: React.MouseEvent) => {
								e.stopPropagation();
								handleToggleTaskStatus(task);
							}}
						/>
					</TaskListItemIcon>

					<TaskListItemButton onClick={() => handleOpenTask(task)}>
						<ListItemText
							primary={<TaskTitle completed={isCompleted}>{task.title || 'Sem título'}</TaskTitle>}
							secondary={
								<TaskSecondaryStack component="span">
									<TaskCreatorText component="span">
										Criada por:{' '}
										<TaskCreatorUnderline>{resolveCreatorLabel(task.createdBy, task.authorName)}</TaskCreatorUnderline>
									</TaskCreatorText>
								</TaskSecondaryStack>
							}
						/>
					</TaskListItemButton>
				</TaskListItem>

				<Divider component="li" />
			</Fragment>
		);
	};

	const renderTaskModal = () => {
		if (!selectedTask) return null;

		const isCompleted = selectedTask.status === 'completed';
		const creatorLabel = resolveCreatorLabel(selectedTask.createdBy, selectedTask.authorName);
		const creatorInitials = getInitials(creatorLabel === 'Você' ? firstName : creatorLabel);
		const assignedLabel = resolveAssignedLabel(selectedTask);
		const assigneeInitials = getInitials(assignedLabel === 'Você' ? firstName : assignedLabel);
		const canEditOrDelete = tasksApi.isOwnerOrAdmin(selectedTask);

		return (
			<TaskModal open={isModalOpen} onClose={handleCloseModal} maxWidth={false}>
				<DialogTitle>{selectedTask.title}</DialogTitle>

				<DialogContent>
					<TaskModalHeader>
						<TaskModalTitleRow>
							<TaskModalTitle>{selectedTask.title}</TaskModalTitle>
							<TaskModalStatusChip completed={isCompleted}>
								{isCompleted ? 'Concluída' : 'Em aberto'}
							</TaskModalStatusChip>
						</TaskModalTitleRow>

						<TaskModalMeta>
							{selectedTask._id ? `Tarefa #${selectedTask._id.slice(-5).toUpperCase()}` : 'Tarefa'}
						</TaskModalMeta>
					</TaskModalHeader>

					<TaskModalSection>
						<TaskModalSectionLabel>Descrição</TaskModalSectionLabel>
						<TaskModalDescriptionBody>
							<TaskModalDescriptionText>
								{(selectedTask as any).description || 'Nenhuma descrição fornecida.'}
							</TaskModalDescriptionText>
						</TaskModalDescriptionBody>
					</TaskModalSection>

					<TaskModalSection>
						<TaskModalSectionLabel>Informações</TaskModalSectionLabel>

						<TaskModalInfoRow>
							<TaskModalInfoLabel>Criada por</TaskModalInfoLabel>
							<TaskModalInfoAvatar variant="primary">{creatorInitials}</TaskModalInfoAvatar>
							<TaskModalInfoValue>{creatorLabel}</TaskModalInfoValue>
						</TaskModalInfoRow>

						{assignedLabel && (
							<TaskModalInfoRow>
								<TaskModalInfoLabel>Atribuída para</TaskModalInfoLabel>
								<TaskModalInfoAvatar variant="secondary">{assigneeInitials}</TaskModalInfoAvatar>
								<TaskModalInfoValue>{assignedLabel}</TaskModalInfoValue>
							</TaskModalInfoRow>
						)}

						<TaskModalInfoRow>
							<TaskModalInfoLabel>Criado em</TaskModalInfoLabel>
							<TaskModalInfoValue>{formatDate(selectedTask.createdAt)}</TaskModalInfoValue>
						</TaskModalInfoRow>

						<TaskModalInfoRow>
							<TaskModalInfoLabel>Atualizado em</TaskModalInfoLabel>
							<TaskModalInfoValue>{formatDate(selectedTask.updatedAt)}</TaskModalInfoValue>
						</TaskModalInfoRow>
					</TaskModalSection>
				</DialogContent>

				<TaskModalActions>
					{canEditOrDelete && (
						<SysButton
							variant="outlined"
							size="small"
							startIcon={<SysIcon name="edit" />}
							onClick={() => handleEditTask(selectedTask)}>
							Editar
						</SysButton>
					)}
					<SysButton size="small" onClick={handleCloseModal}>
						Fechar
					</SysButton>
				</TaskModalActions>
			</TaskModal>
		);
	};

	return (
		<Container>
			<Header>
				<HeaderTitle variant="h3">Olá, {firstName}</HeaderTitle>
				<HeaderSubtitle variant="body1">Seus projetos muito mais organizados.</HeaderSubtitle>
			</Header>

			<SectionWrapper>
				<SectionLabel>
					<SectionLabelTitle variant="h5">Adicionadas Recentemente</SectionLabelTitle>
				</SectionLabel>

				<ListContainer>
					{loading ? (
						<SysLoading label="Carregando tarefas..." size="small" />
					) : mostRecentTask ? (
						<List disablePadding>{renderTaskItem(mostRecentTask, 0)}</List>
					) : (
						<StateContainer>
							<Typography>Tarefas não encontradas</Typography>
						</StateContainer>
					)}
				</ListContainer>
			</SectionWrapper>

			{!loading && remainingTasks.length > 0 && (
				<RemainingListContainer>
					<List disablePadding>{remainingTasks.map((task, idx) => renderTaskItem(task, idx))}</List>
				</RemainingListContainer>
			)}

			{renderTaskModal()}

			<FooterSection>
				<GoToTasksButton variant="contained" onClick={handleGoToTasks}>
					Ir para Tarefas
					<GoToTasksIcon />
				</GoToTasksButton>
			</FooterSection>
		</Container>
	);
};

export default HomePage;