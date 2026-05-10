import { ElementType } from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, Typography, TypographyProps, Button, ButtonProps, Chip, ChipProps } from '@mui/material';

interface ITasksListStyles {
	PageWrapper: ElementType<BoxProps>;
	PageHeader: ElementType<BoxProps>;
	Container: ElementType<BoxProps>;
	SearchWrapper: ElementType<BoxProps>;
	TaskSection: ElementType<BoxProps>;
	TaskItem: ElementType<BoxProps & { selected?: boolean }>;
	TaskCheckbox: ElementType<any>;
	TaskInfo: ElementType<BoxProps>;
	TaskTitle: ElementType<TypographyProps & { completed?: boolean }>;
	TaskCreator: ElementType<TypographyProps>;
	ActionButton: ElementType<ButtonProps>;
	DetailPanel: ElementType<BoxProps & { open?: boolean }>;
	DetailPanelHeader: ElementType<BoxProps>;
	DetailPanelContent: ElementType<BoxProps>;
	DetailPanelFooter: ElementType<BoxProps>;
	DetailTitleRow: ElementType<BoxProps>;
	DetailStatusDot: ElementType<BoxProps & { completed?: boolean }>;
	DetailField: ElementType<BoxProps>;
	DetailFieldLabel: ElementType<TypographyProps>;
	DetailCreatorText: ElementType<TypographyProps>;
	SectionHeader: ElementType<BoxProps>;
	SectionTitle: ElementType<TypographyProps>;
	SectionCount: ElementType<ChipProps>;
	EmptySection: ElementType<TypographyProps>;
	PaginationWrapper: ElementType<BoxProps>;
}

const TasksListStyles: ITasksListStyles = {
	PageWrapper: styled(Box)(() => ({
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		height: 'calc(100vh - 56px)',
		overflow: 'hidden',
		position: 'relative'
	})),

	PageHeader: styled(Box)(({ theme }) => ({
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		marginBottom: theme.spacing(1),
		flexShrink: 0
	})),

	Container: styled(Box)(({ theme }) => ({
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		flex: 1,
		padding: theme.spacing(4),
		transition: 'all 0.3s ease',
		minWidth: 0,
		overflowY: 'auto',
		overflowX: 'hidden',
		height: '100%',
		'& > *': {
			maxWidth: '1200px',
			width: '100%'
		}
	})),

	SearchWrapper: styled(Box)(({ theme }) => ({
		width: '100%',
		marginBottom: theme.spacing(1),
		flexShrink: 0,
		'& .MuiFormControl-root': {
			margin: 0
		}
	})),

	TaskSection: styled(Box)(({ theme }) => ({
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		marginTop: theme.spacing(3),
		paddingBottom: theme.spacing(4)
	})),

	SectionHeader: styled(Box)(({ theme }) => ({
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing(1),
		padding: theme.spacing(1, 0.5),
		cursor: 'pointer',
		borderRadius: theme.shape.borderRadius,
		userSelect: 'none',
		'&:hover': {
			backgroundColor: theme.palette.action.hover
		}
	})),

	SectionTitle: styled(Typography)(({ theme }) => ({
		fontWeight: 600,
		color: theme.palette.text.primary,
		flexGrow: 1
	})),

	SectionCount: styled(Chip)(({ theme }) => ({
		height: 22,
		fontSize: 12,
		fontWeight: 600,
		backgroundColor: theme.palette.action.selected,
		color: theme.palette.text.secondary,
		'& .MuiChip-label': {
			padding: theme.spacing(0, 1)
		}
	})),

	EmptySection: styled(Typography)(({ theme }) => ({
		color: theme.palette.text.secondary,
		padding: theme.spacing(2, 1),
		fontSize: 14
	})),

	TaskItem: styled(Box, {
		shouldForwardProp: (prop) => prop !== 'selected'
	})<{ selected?: boolean }>(({ theme, selected }) => ({
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(2),
		marginBottom: theme.spacing(1),
		borderRadius: theme.shape.borderRadius,
		backgroundColor: selected ? theme.palette.action.selected : theme.palette.background.paper,
		boxShadow: selected ? 'none' : '0 2px 4px rgba(0,0,0,0.05)',
		border: selected ? `1px solid ${theme.palette.primary.light}` : '1px solid transparent',
		transition: 'all 0.2s',
		cursor: 'pointer',
		'&:hover': {
			backgroundColor: selected ? theme.palette.action.selected : theme.palette.grey[50]
		}
	})),

	TaskCheckbox: styled('div', {
		shouldForwardProp: (prop) => prop !== 'completed'
	})<{ completed?: boolean }>(({ theme, completed }) => ({
		width: 24,
		height: 24,
		borderRadius: '50%',
		border: `2px solid ${completed ? theme.palette.success.main : theme.palette.grey[300]}`,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexShrink: 0,
		cursor: 'pointer',
		marginRight: theme.spacing(2),
		backgroundColor: completed ? theme.palette.success.main : theme.palette.common.white,
		transition: 'all 0.2s',
		'&:before': {
			content: completed ? '"✔"' : '""',
			color: completed ? theme.palette.common.white : 'transparent',
			fontSize: 14,
			fontWeight: 'bold'
		}
	})),

	TaskInfo: styled(Box)(({ theme }) => ({
		display: 'flex',
		flexDirection: 'column',
		flexGrow: 1,
		marginLeft: theme.spacing(1)
	})),

	TaskTitle: styled(Typography, {
		shouldForwardProp: (prop) => prop !== 'completed'
	})<{ completed?: boolean }>(({ theme, completed }) => ({
		fontSize: 16,
		fontWeight: 700,
		color: completed ? theme.palette.text.disabled : theme.palette.text.primary,
		textDecoration: completed ? 'line-through' : 'none',
		transition: 'all 0.2s'
	})),

	TaskCreator: styled(Typography)(({ theme }) => ({
		fontSize: 13,
		color: theme.palette.text.secondary,
		marginTop: theme.spacing(0.25)
	})),

	ActionButton: styled(Button)(({ theme }) => ({
		minWidth: 'auto',
		padding: theme.spacing(0.5),
		color: theme.palette.text.secondary,
		backgroundColor: 'transparent',
		border: '1px solid transparent',
		borderRadius: theme.shape.borderRadius,
		'&:hover': {
			backgroundColor: 'transparent',
			color: theme.palette.primary.main,
			border: `1px solid ${theme.palette.primary.main}`
		}
	})),

	DetailPanel: styled(Box, {
		shouldForwardProp: (prop) => prop !== 'open'
	})<{ open?: boolean }>(({ theme, open }) => ({
		width: open ? '380px' : '0px',
		minWidth: open ? '380px' : '0px',
		overflow: 'hidden',
		display: 'flex',
		flexDirection: 'column',
		borderLeft: open ? `1px solid ${theme.palette.divider}` : 'none',
		backgroundColor: theme.palette.background.paper,
		transition: 'width 0.3s ease, min-width 0.3s ease',
		height: '100%',
		flexShrink: 0
	})),

	DetailPanelHeader: styled(Box)(({ theme }) => ({
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing(1),
		padding: theme.spacing(1.5, 2),
		borderBottom: `1px solid ${theme.palette.divider}`,
		flexShrink: 0,
		minWidth: 0
	})),

	DetailPanelContent: styled(Box)(({ theme }) => ({
		flex: 1,
		overflow: 'auto',
		padding: theme.spacing(2),
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing(1.5)
	})),

	DetailPanelFooter: styled(Box)(({ theme }) => ({
		padding: theme.spacing(1.5, 3),
		borderTop: `1px solid ${theme.palette.divider}`,
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing(1),
		flexShrink: 0
	})),

	DetailTitleRow: styled(Box)(({ theme }) => ({
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing(1.5),
		cursor: 'pointer',
		flex: 1,
		minWidth: 0,
		overflow: 'hidden'
	})),

	DetailStatusDot: styled(Box, {
		shouldForwardProp: (prop) => prop !== 'completed'
	})<{ completed?: boolean }>(({ theme, completed }) => ({
		width: 20,
		height: 20,
		borderRadius: '50%',
		flexShrink: 0,
		marginTop: 3,
		cursor: 'pointer',
		transition: 'all 0.2s',
		border: `2px solid ${completed ? theme.palette.success.main : theme.palette.grey[300]}`,
		backgroundColor: completed ? theme.palette.success.main : theme.palette.common.white,
		'&:before': {
			content: completed ? '"✔"' : '""',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			color: completed ? theme.palette.common.white : 'transparent',
			fontSize: 11,
			fontWeight: 'bold',
			lineHeight: '16px',
			paddingLeft: 2
		}
	})),

	DetailField: styled(Box)(({ theme }) => ({
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing(0.5)
	})),

	DetailFieldLabel: styled(Typography)(({ theme }) => ({
		fontSize: 12,
		fontWeight: 600,
		color: theme.palette.text.secondary,
		textTransform: 'uppercase',
		letterSpacing: '0.5px'
	})),

	DetailCreatorText: styled(Typography)(({ theme }) => ({
		fontSize: 12,
		color: theme.palette.text.secondary,
		textAlign: 'right'
	})),

	PaginationWrapper: styled(Box)(({ theme }) => ({
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(1)
	})),
};

export default TasksListStyles;