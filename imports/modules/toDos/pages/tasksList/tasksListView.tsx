import React, { useContext, useState } from 'react';
import { Typography, Divider, Button, IconButton, Chip, Stack, Tooltip } from '@mui/material';
import { Meteor } from 'meteor/meteor';
import { TasksListControllerContext } from './tasksListController';
import TasksListStyles from './tasksListStyles';
import SysIcon from '../../../../ui/components/sysIcon/sysIcon';

const {
	PageWrapper, PageHeader, Container, TaskSection, TaskItem, TaskCheckbox, TaskInfo, TaskTitle, TaskCreator, ActionButton,
	DetailPanel, DetailPanelHeader, DetailPanelContent, DetailPanelFooter, DetailTitleRow, DetailStatusDot, DetailField,
	DetailFieldLabel, DetailCreatorText
} = TasksListStyles;

const TasksListView = () => {
	const controller = useContext(TasksListControllerContext);

	const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
	const selectedTask = controller.tasks.find((t) => t._id === selectedTaskId) ?? null;
	const isDetailPanelOpen = !!selectedTask;

	const handleOpenTask = (id: string) => {
		setSelectedTaskId((prev) => (prev === id ? null : id));
	};

	const handleCloseDetailPanel = () => setSelectedTaskId(null);

	return (
		<PageWrapper>
			<Container>
				<PageHeader>
					<Typography variant="h5" fontWeight={600}>
						Tarefas
					</Typography>
					<Button variant="contained" startIcon={<SysIcon name="add" />} onClick={() => controller.onAddTaskClick()}>
						Nova Tarefa
					</Button>
				</PageHeader>

				<TaskSection>
					{controller.loading ? (
						<Typography variant="body1" color="text.secondary">
							Carregando tarefas…
						</Typography>
					) : controller.tasks.length === 0 ? (
						<Typography variant="body1" color="text.secondary">
							Nenhuma tarefa encontrada.
						</Typography>
					) : (
						controller.tasks.map((task) => (
							<TaskItem key={task._id} selected={selectedTaskId === task._id} onClick={() => handleOpenTask(task._id!)}>
								<Tooltip
									title={task.status === 'completed' ? 'Marcar como pendente' : 'Marcar como concluída'}
									placement="top">
									<TaskCheckbox
										completed={task.status === 'completed'}
										onClick={(e: React.MouseEvent) => {
											e.stopPropagation();
											controller.onTaskCheckboxClick(e, task._id!);
										}}
									/>
								</Tooltip>

								<TaskInfo>
									<TaskTitle completed={task.status === 'completed'}>{task.title}</TaskTitle>
									<TaskCreator>
										Criada por: {task.createdBy === Meteor.userId() ? 'Você' : task.authorName || 'Desconhecido'}
									</TaskCreator>
								</TaskInfo>

								<Stack direction="row" spacing={0.5}>
									<Tooltip title="Editar">
										<ActionButton
											onClick={(e: React.MouseEvent) => {
												e.stopPropagation();
												controller.onTaskClick(task._id!);
											}}>
											<SysIcon name="edit" />
										</ActionButton>
									</Tooltip>
									<Tooltip title="Excluir">
										<ActionButton
											onClick={(e: React.MouseEvent) => {
												e.stopPropagation();
												controller.onDeleteTask(task);
											}}>
											<SysIcon name="delete" />
										</ActionButton>
									</Tooltip>
								</Stack>
							</TaskItem>
						))
					)}
				</TaskSection>
			</Container>

			<DetailPanel open={isDetailPanelOpen}>
				{selectedTask && (
					<>
						<DetailPanelHeader>
							<Tooltip title="Fechar">
								<IconButton size="small" onClick={handleCloseDetailPanel} aria-label="Fechar">
									<SysIcon name="close" />
								</IconButton>
							</Tooltip>
						</DetailPanelHeader>

						<DetailPanelContent>
							<Tooltip
								title={selectedTask.status === 'completed' ? 'Marcar como pendente' : 'Marcar como concluída'}
								placement="top-start">
								<DetailTitleRow
									onClick={(e: React.MouseEvent) => {
										e.stopPropagation();
										controller.onTaskCheckboxClick(e, selectedTask._id!);
									}}>
									<DetailStatusDot completed={selectedTask.status === 'completed'} />
									<Typography variant="subtitle1" fontWeight={700} lineHeight={1.4}>
										{selectedTask.title}
									</Typography>
								</DetailTitleRow>
							</Tooltip>

							<Divider />

							{selectedTask.description && (
								<DetailField>
									<DetailFieldLabel>Descrição</DetailFieldLabel>
									<Typography variant="body2" lineHeight={1.7}>
										{selectedTask.description}
									</Typography>
								</DetailField>
							)}

							<DetailField>
								<DetailFieldLabel>Status</DetailFieldLabel>
								<Stack direction="row">
									<Chip
										size="small"
										label={selectedTask.status === 'completed' ? 'Concluída' : 'Pendente'}
										color={selectedTask.status === 'completed' ? 'success' : 'default'}
										variant="outlined"
									/>
								</Stack>
							</DetailField>

							<DetailField>
								<DetailFieldLabel>Criado em</DetailFieldLabel>
								<Stack direction="row">
									<Chip
										size="small"
										label={selectedTask.createdAt ? new Date(selectedTask.createdAt).toLocaleString() : '-'}
										color='default'
										variant="outlined"
										icon={<SysIcon name="accessTime" />}
									/>
								</Stack>
							</DetailField>

							<DetailField>
								<DetailFieldLabel>Atualizado em</DetailFieldLabel>
								<Stack direction="row">
									<Chip
										size="small"
										label={selectedTask.updatedAt ? new Date(selectedTask.updatedAt).toLocaleString() : '-'}
										color='default'
										variant="outlined"
										icon={<SysIcon name="update" />}
									/>
								</Stack>
							</DetailField>

							<DetailField>
								<DetailFieldLabel>Tipo</DetailFieldLabel>
								<Stack direction="row">
									<Chip
										size="small"
										label={selectedTask.personal ? 'Pessoal' : 'Time'}
										color={selectedTask.personal ? 'primary' : 'default'}
										variant="outlined"
										icon={<SysIcon name={selectedTask.personal ? 'person' : 'group'} />}
									/>
								</Stack>
							</DetailField>
						</DetailPanelContent>

						<DetailPanelFooter>
							<Button
								fullWidth
								variant="outlined"
								startIcon={<SysIcon name="edit" />}
								onClick={() => controller.onTaskClick(selectedTask._id!)}>
								Editar tarefa
							</Button>
							<DetailCreatorText>
								Criada por:{' '}
								{selectedTask.createdBy === Meteor.userId() ? 'Você' : selectedTask.authorName || 'Desconhecido'}
							</DetailCreatorText>
						</DetailPanelFooter>
					</>
				)}
			</DetailPanel>
		</PageWrapper>
	);
};

export default TasksListView;