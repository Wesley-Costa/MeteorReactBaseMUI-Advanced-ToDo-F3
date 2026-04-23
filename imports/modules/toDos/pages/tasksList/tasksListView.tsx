import React, { useContext, useState } from 'react';
import { Typography, Divider, IconButton, Chip, Stack, Tooltip } from '@mui/material';
import { Meteor } from 'meteor/meteor';
import { TasksListControllerContext } from './tasksListController';
import TasksListStyles from './tasksListStyles';
import SysIcon from '../../../../ui/components/sysIcon/sysIcon';
import SysTextField from '../../../../ui/components/sysFormFields/sysTextField/sysTextField';
import { SysFab } from '../../../../ui/components/sysFab/sysFab';
import { SysLoading } from '../../../../ui/components/sysLoading/sysLoading';
import { SysButton } from '../../../../ui/components/SimpleFormFields/SysButton/SysButton';
import { ITask } from '../../api/tasksSch';

const {
	PageWrapper, PageHeader, Container, TaskSection, TaskItem, TaskCheckbox, DetailPanelContent, 
	TaskInfo, TaskTitle, TaskCreator, ActionButton, DetailPanel, DetailPanelHeader, DetailPanelFooter, 
	DetailTitleRow, DetailStatusDot, DetailField, DetailFieldLabel, DetailCreatorText, SearchWrapper, 
	SectionHeader, SectionTitle, SectionCount, EmptySection
} = TasksListStyles;

const TasksListView = () => {
	const controller = useContext(TasksListControllerContext);
	const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
	const [openCollapsed, setOpenCollapsed] = useState(false);
	const [completedCollapsed, setCompletedCollapsed] = useState(false);

	const selectedTask = controller.tasks.find((t) => t._id === selectedTaskId) ?? null;
	const isDetailPanelOpen = !!selectedTask;

	const handleOpenTask = (id: string) => {
		setSelectedTaskId((prev) => (prev === id ? null : id));
	};

	const handleCloseDetailPanel = () => setSelectedTaskId(null);

	const renderTaskItem = (task: ITask) => (
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
	);

	return (
		<PageWrapper>
			<Container>
				<PageHeader>
					<Typography variant="h5" fontWeight={600}>
						Tarefas
					</Typography>

					<SysFab
						variant="extended"
						startIcon={<SysIcon name="add" />}
						text="Nova Tarefa"
						onClick={controller.onAddTaskClick}
					/>
				</PageHeader>

				<SearchWrapper>
					<SysTextField
						name="taskSearch"
						placeholder="Pesquisar tarefas por título ou descrição…"
						value={controller.searchText}
						onChange={(e) => controller.onSearchChange(e.target.value)}
						size="small"
						fullWidth
						startAdornment={<SysIcon name="search" />}
						endAdornment={
							controller.searchText ? (
								<Tooltip title="Limpar pesquisa">
									<IconButton
										size="small"
										onClick={() => controller.onSearchChange('')}
										aria-label="Limpar pesquisa">
										<SysIcon name="close" />
									</IconButton>
								</Tooltip>
							) : null
						}
					/>
				</SearchWrapper>

				{controller.loading ? (
					<SysLoading
						label="Carregando tarefas…"
						size="medium"
						sxMap={{ container: { mt: 6 } }}
					/>
				) : (
					<TaskSection>
						<SectionHeader onClick={() => setOpenCollapsed((v) => !v)}>
							<SysIcon name={openCollapsed ? 'chevronRight' : 'expandMore'} />
							<SectionTitle variant="subtitle1">Não Concluídas</SectionTitle>
							<SectionCount label={controller.openTasks.length} size="small" />
						</SectionHeader>

						{!openCollapsed && (
							<>
								{controller.openTasks.length === 0 ? (
									<EmptySection variant="body2">
										{controller.searchText
											? `Nenhuma tarefa pendente encontrada para "${controller.searchText}".`
											: 'Nenhuma tarefa pendente.'}
									</EmptySection>
								) : (
									controller.openTasks.map(renderTaskItem)
								)}
							</>
						)}

						<SectionHeader onClick={() => setCompletedCollapsed((v) => !v)} sx={{ mt: 2 }}>
							<SysIcon name={completedCollapsed ? 'chevronRight' : 'expandMore'} />
							<SectionTitle variant="subtitle1">Concluídas</SectionTitle>
							<SectionCount label={controller.completedTasks.length} size="small" />
						</SectionHeader>

						{!completedCollapsed && (
							<>
								{controller.completedTasks.length === 0 ? (
									<EmptySection variant="body2">
										{controller.searchText
											? `Nenhuma tarefa concluída encontrada para "${controller.searchText}".`
											: 'Nenhuma tarefa concluída.'}
									</EmptySection>
								) : (
									controller.completedTasks.map(renderTaskItem)
								)}
							</>
						)}
					</TaskSection>
				)}
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
										color="default"
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
										color="default"
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
							<SysButton
								fullWidth
								variant="outlined"
								startIcon={<SysIcon name="edit" />}
								onClick={() => controller.onTaskClick(selectedTask._id!)}>
								Editar tarefa
							</SysButton>
							<DetailCreatorText>
								Criada por:{' '}
								{selectedTask.createdBy === Meteor.userId()
									? 'Você'
									: selectedTask.authorName || 'Desconhecido'}
							</DetailCreatorText>
						</DetailPanelFooter>
					</>
				)}
			</DetailPanel>
		</PageWrapper>
	);
};

export default TasksListView;