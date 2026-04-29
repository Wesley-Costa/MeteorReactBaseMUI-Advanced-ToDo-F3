import React, { useContext, useState } from 'react';
import { Typography, IconButton, Chip, Stack, Tooltip, Pagination } from '@mui/material';
import { Meteor } from 'meteor/meteor';
import { TasksListControllerContext } from './tasksListController';
import TasksListStyles from './tasksListStyles';
import SysIcon from '../../../../ui/components/sysIcon/sysIcon';
import SysTextField from '../../../../ui/components/sysFormFields/sysTextField/sysTextField';
import { SysFab } from '../../../../ui/components/sysFab/sysFab';
import { SysLoading } from '../../../../ui/components/sysLoading/sysLoading';
import { SysButton } from '../../../../ui/components/SimpleFormFields/SysButton/SysButton';
import { ITask } from '../../api/tasksSch';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import SysLabelView from '../../../../ui/components/sysLabelView/sysLabelView';

const {
	PageWrapper, PageHeader, Container, TaskSection, TaskItem, TaskCheckbox, DetailPanelContent, TaskInfo, 
	TaskTitle, TaskCreator, ActionButton, DetailPanel, DetailPanelHeader, DetailPanelFooter, DetailTitleRow, 
	DetailStatusDot, DetailCreatorText, SearchWrapper, SectionHeader, SectionTitle, SectionCount, EmptySection, 
	PaginationWrapper
} = TasksListStyles;

const resolveAssignedLabel = (task: ITask): string => {
	if (!task.assignedTo) return 'Não atribuída';
	if (task.assignedTo === Meteor.userId()) return 'Você';
	return task.assignedTo;
};

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
			<Tooltip title={task.status === 'completed' ? 'Marcar como pendente' : 'Marcar como concluída'} placement="top">
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

	const estimatedOpenPages = controller.openPage + (controller.hasNextOpen ? 1 : 0);
	const estimatedCompletedPages = controller.completedPage + (controller.hasNextCompleted ? 1 : 0);

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
									<IconButton size="small" onClick={() => controller.onSearchChange('')} aria-label="Limpar pesquisa">
										<SysIcon name="close" />
									</IconButton>
								</Tooltip>
							) : null
						}
					/>
				</SearchWrapper>

				{controller.loading ? (
					<SysLoading label="Carregando tarefas…" size="medium" sxMap={{ container: { mt: 6 } }} />
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
								{estimatedOpenPages > 1 && (
									<PaginationWrapper>
										<Pagination
											count={estimatedOpenPages}
											page={controller.openPage}
											onChange={(_, page) => controller.onOpenPageChange(page)}
											size="small"
											showFirstButton
											showLastButton
										/>
									</PaginationWrapper>
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
								{estimatedCompletedPages > 1 && (
									<PaginationWrapper>
										<Pagination
											count={estimatedCompletedPages}
											page={controller.completedPage}
											onChange={(_, page) => controller.onCompletedPageChange(page)}
											size="small"
											showFirstButton
											showLastButton
										/>
									</PaginationWrapper>
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
							<Tooltip
								title={selectedTask.status === 'completed' ? 'Marcar como pendente' : 'Marcar como concluída'}
								placement="top-start">
								<DetailTitleRow
									onClick={(e: React.MouseEvent) => {
										e.stopPropagation();
										controller.onTaskCheckboxClick(e, selectedTask._id!);
									}}>
									<DetailStatusDot completed={selectedTask.status === 'completed'} />
									<Typography variant="subtitle1" fontWeight={700} lineHeight={1.4} noWrap>
										{selectedTask.title}
									</Typography>
								</DetailTitleRow>
							</Tooltip>

							<Stack direction="row" spacing={0.5} flexShrink={0}>
								<Tooltip title="Excluir tarefa">
									<IconButton
										size="small"
										onClick={() => {
											handleCloseDetailPanel();
											controller.onDeleteTask(selectedTask);
										}}
										aria-label="Excluir tarefa">
										<SysIcon name="delete" />
									</IconButton>
								</Tooltip>
								<Tooltip title="Fechar">
									<IconButton size="small" onClick={handleCloseDetailPanel} aria-label="Fechar">
										<SysIcon name="close" />
									</IconButton>
								</Tooltip>
							</Stack>
						</DetailPanelHeader>

						<DetailPanelContent>
							{selectedTask.description && (
								<SysLabelView label="Descrição">
									<Typography variant="body2" lineHeight={1.7}>
										{selectedTask.description}
									</Typography>
								</SysLabelView>
							)}

							<SysLabelView label="Status">
								<Chip
									size="small"
									label={selectedTask.status === 'completed' ? 'Concluída' : 'Pendente'}
									color={selectedTask.status === 'completed' ? 'success' : 'default'}
									variant="outlined"
								/>
							</SysLabelView>

							<SysLabelView label="Criado em">
								<Chip
									size="small"
									label={selectedTask.createdAt ? new Date(selectedTask.createdAt).toLocaleString() : '-'}
									color="default"
									variant="outlined"
									icon={<SysIcon name="accessTime" />}
								/>
							</SysLabelView>

							<SysLabelView label="Atualizado em">
								<Chip
									size="small"
									label={selectedTask.updatedAt ? new Date(selectedTask.updatedAt).toLocaleString() : '-'}
									color="default"
									variant="outlined"
									icon={<SysIcon name="update" />}
								/>
							</SysLabelView>

							<SysLabelView label="Atribuído a">
								<Chip
									size="small"
									label={resolveAssignedLabel(selectedTask)}
									color="default"
									variant="outlined"
									icon={<AssignmentIndIcon />}
								/>
							</SysLabelView>

							<SysLabelView label="Tipo">
								<Chip
									size="small"
									label={selectedTask.personal ? 'Pessoal' : 'Time'}
									color="default"
									variant="outlined"
									icon={<SysIcon name={selectedTask.personal ? 'person' : 'group'} />}
								/>
							</SysLabelView>
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
