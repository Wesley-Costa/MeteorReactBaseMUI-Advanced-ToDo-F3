import { ElementType } from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps } from '@mui/material';

interface ITasksEditStyles {
	Container: ElementType<BoxProps>;
	Header: ElementType<BoxProps>;
	Body: ElementType<BoxProps>;
	Footer: ElementType<BoxProps>;
	FormColumn: ElementType<BoxProps>;
	InlineRow: ElementType<BoxProps>;
}

const TasksEditStyles: ITasksEditStyles = {
	Container: styled(Box)(({ theme }) => ({
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		maxWidth: '720px',
		margin: '0 auto',
		marginTop: '56px',
		padding: theme.spacing(4),
		gap: theme.spacing(3)
	})),

	Header: styled(Box)(({ theme }) => ({
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.spacing(1),
		width: '100%',
		paddingBottom: theme.spacing(2),
		borderBottom: `1px solid ${theme.palette.divider}`
	})),

	Body: styled(Box)(({ theme }) => ({
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		gap: theme.spacing(3)
	})),

	FormColumn: styled(Box)(({ theme }) => ({
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing(3)
	})),

	InlineRow: styled(Box)(({ theme }) => ({
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.spacing(3),
		width: '100%',
		[theme.breakpoints.down('sm')]: {
			flexDirection: 'column',
			alignItems: 'flex-start'
		}
	})),

	Footer: styled(Box)(({ theme }) => ({
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		width: '100%',
		gap: theme.spacing(2),
		paddingTop: theme.spacing(3),
		marginTop: theme.spacing(1),
		borderTop: `1px solid ${theme.palette.divider}`
	}))
};

export default TasksEditStyles;