import { ElementType } from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, Button, ButtonProps, Typography, TypographyProps, Stack, StackProps, ListItem, ListItemProps,
	ListItemIcon, ListItemIconProps, ListItemButton, ListItemButtonProps, Dialog, DialogProps } from '@mui/material';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { SysSectionPaddingXY } from '/imports/ui/layoutComponents/sysLayoutComponents';

interface IHomeStyles {
	Container: ElementType<BoxProps>;
	Header: ElementType<BoxProps>;
	HeaderTitle: ElementType<TypographyProps>;
	HeaderSubtitle: ElementType<TypographyProps>;
	RowButtons: ElementType<BoxProps>;
	SectionWrapper: ElementType<BoxProps>;
	SectionLabel: ElementType<BoxProps>;
	SectionLabelTitle: ElementType<TypographyProps>;
	ListContainer: ElementType<BoxProps>;
	RemainingListContainer: ElementType<BoxProps>;
	TaskListItem: ElementType<ListItemProps>;
	TaskListItemIcon: ElementType<ListItemIconProps>;
	TaskListItemButton: ElementType<ListItemButtonProps>;
	TaskSecondaryStack: ElementType<StackProps>;
	TaskTitle: ElementType<TypographyProps & { completed?: boolean }>;
	TaskCreatorText: ElementType<TypographyProps>;
	TaskCreatorUnderline: ElementType<any>;
	TaskCheckbox: ElementType<any>;
	TaskActions: ElementType<BoxProps>;
	ActionButton: ElementType<ButtonProps>;
	StateContainer: ElementType<BoxProps>;
	TaskModal: ElementType<DialogProps>;
	TaskModalHeader: ElementType<BoxProps>;
	TaskModalTitleRow: ElementType<BoxProps>;
	TaskModalTitle: ElementType<TypographyProps>;
	TaskModalStatusChip: ElementType<any>;
	TaskModalMeta: ElementType<TypographyProps>;
	TaskModalSection: ElementType<BoxProps>;
	TaskModalSectionLabel: ElementType<TypographyProps>;
	TaskModalDescriptionBody: ElementType<BoxProps>;
	TaskModalDescriptionText: ElementType<TypographyProps>;
	TaskModalInfoRow: ElementType<BoxProps>;
	TaskModalInfoLabel: ElementType<TypographyProps>;
	TaskModalInfoAvatar: ElementType<any>;
	TaskModalInfoValue: ElementType<TypographyProps>;
	TaskModalActions: ElementType<BoxProps>;
	FooterSection: ElementType<BoxProps>;
	GoToTasksIcon: ElementType<any>;
	GoToTasksButton: ElementType<ButtonProps>;
	PaginationContainer: ElementType<BoxProps>;
	PaginationButton: ElementType<ButtonProps>;
}

const HomeStyles: IHomeStyles = {
	Container: styled(SysSectionPaddingXY)(() => ({
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		gap: '2rem',
		width: '100%',
		maxWidth: '1200px',
		margin: '0 auto',
		marginTop: '56px'
	})),

	Header: styled(Box)(() => ({
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		gap: '0.35rem',
		width: '100%'
	})),

	HeaderTitle: styled(Typography)(() => ({
		color: 'var(--color-text-primary, #111111)',
		fontWeight: 800,
		fontSize: 40,
		lineHeight: 1.15,
		letterSpacing: '-0.5px'
	})),

	HeaderSubtitle: styled(Typography)(() => ({
		color: 'var(--color-text-secondary, #555555)',
		fontSize: 15,
		lineHeight: 1.5,
		borderLeft: '2px solid #CCCCCC',
		paddingLeft: '0.65rem',
		marginTop: '0.15rem'
	})),

	RowButtons: styled(Box)(({ theme }) => ({
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		gap: '0.5rem',
		flexWrap: 'wrap',
		rowGap: '0.8rem',
		[theme.breakpoints.down('lg')]: { justifyContent: 'space-around' },
		[theme.breakpoints.down('sm')]: { columnGap: '1rem' }
	})),

	SectionWrapper: styled(Box)(({ theme }) => ({
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'flex-start',
		width: '100%',
		gap: 0,
		borderTop: `1px solid ${theme.palette.divider}`,
		borderBottom: `1px solid ${theme.palette.divider}`,
		[theme.breakpoints.down('sm')]: { flexDirection: 'column' }
	})),

	SectionLabel: styled(Box)(({ theme }) => ({
		minWidth: 220,
		width: 220,
		flexShrink: 0,
		paddingTop: theme.spacing(2.5),
		paddingRight: theme.spacing(3),
		[theme.breakpoints.down('sm')]: {
			width: '100%',
			paddingBottom: theme.spacing(1)
		}
	})),

	SectionLabelTitle: styled(Typography)(() => ({
		color: 'var(--color-text-primary, #111111)',
		fontSize: 16,
		fontWeight: 700,
		letterSpacing: '-0.1px'
	})),

	ListContainer: styled(Box)(({ theme }) => ({
		flex: 1,
		backgroundColor: 'transparent',
		borderLeft: `1px solid ${theme.palette.divider}`,
		width: '100%',
		[theme.breakpoints.down('sm')]: {
			borderLeft: 'none',
			borderTop: `1px solid ${theme.palette.divider}`
		}
	})),

	RemainingListContainer: styled(Box)(({ theme }) => ({
		width: '100%',
		backgroundColor: 'transparent',
		marginTop: `-${theme.spacing(2)}`
	})),

	TaskListItem: styled(ListItem)(() => ({
		paddingLeft: 12,
		paddingRight: 12
	})),

	TaskListItemIcon: styled(ListItemIcon)(() => ({
		minWidth: 52,
		justifyContent: 'center',
		paddingTop: 12
	})),

	TaskListItemButton: styled(ListItemButton)(() => ({
		paddingTop: 12,
		paddingBottom: 12
	})),

	TaskSecondaryStack: styled(Stack)(() => ({
		gap: 2,
		display: 'inline-flex',
		flexDirection: 'column'
	})),

	TaskTitle: styled(Typography)<{ completed?: boolean }>(({ theme, completed }) => ({
		fontWeight: completed ? 400 : 600,
		color: completed ? theme.palette.text.disabled : theme.palette.text.primary,
		textDecoration: completed ? 'line-through' : 'none',
		fontSize: 15
	})),

	TaskCreatorText: styled(Typography)(({ theme }) => ({
		fontSize: 13,
		color: theme.palette.text.secondary
	})),

	TaskCreatorUnderline: styled('span')(() => ({
		textDecoration: 'underline',
		cursor: 'default'
	})),

	TaskCheckbox: styled('div')<{ completed?: boolean }>(({ theme, completed }) => ({
		width: 24,
		height: 24,
		borderRadius: '50%',
		border: `2px solid ${completed ? theme.palette.success.main : theme.palette.grey[300]}`,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexShrink: 0,
		cursor: 'pointer',
		backgroundColor: completed ? theme.palette.success.main : theme.palette.common.white,
		transition: 'all 0.2s',
		'&:before': {
			content: completed ? '"✔"' : '""',
			color: completed ? theme.palette.common.white : 'transparent',
			fontSize: 14,
			fontWeight: 'bold'
		}
	})),

	TaskActions: styled(Box)(() => ({
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4
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

	StateContainer: styled(Box)(() => ({
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 32,
		paddingBottom: 32
	})),

	TaskModal: styled(Dialog)(({ theme }) => ({
		'& .MuiDialog-paper': {
			width: '100%',
			maxWidth: 580,
			borderRadius: 16,
			overflow: 'hidden',
			[theme.breakpoints.down('sm')]: { margin: 16 }
		},
		'& .MuiDialogTitle-root': { display: 'none' },
		'& .MuiDialogContent-root': { padding: 0 },
		'& .MuiDialogActions-root': { padding: 0 }
	})),

	TaskModalHeader: styled(Box)(({ theme }) => ({
		padding: theme.spacing(3, 3, 2.5),
		borderBottom: `1px solid ${theme.palette.divider}`
	})),

	TaskModalTitleRow: styled(Box)(() => ({
		display: 'flex',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		gap: 12,
		marginBottom: 8
	})),

	TaskModalTitle: styled(Typography)(({ theme }) => ({
		fontSize: 18,
		fontWeight: 600,
		lineHeight: 1.35,
		color: theme.palette.text.primary,
		flex: 1
	})),

	TaskModalStatusChip: styled('span')<{ completed?: boolean }>(({ theme, completed }) => ({
		flexShrink: 0,
		display: 'inline-flex',
		alignItems: 'center',
		fontSize: 11,
		fontWeight: 600,
		letterSpacing: '0.03em',
		padding: '3px 10px',
		borderRadius: 999,
		backgroundColor: completed ? theme.palette.success.light : theme.palette.grey[100],
		color: completed ? theme.palette.success.dark : theme.palette.text.secondary,
		border: `1px solid ${completed ? theme.palette.success.main : theme.palette.divider}`
	})),

	TaskModalMeta: styled(Typography)(({ theme }) => ({
		fontSize: 12,
		color: theme.palette.text.disabled
	})),

	TaskModalSection: styled(Box)(({ theme }) => ({
		padding: theme.spacing(2, 3),
		borderBottom: `1px solid ${theme.palette.divider}`
	})),

	TaskModalSectionLabel: styled(Typography)(({ theme }) => ({
		fontSize: 11,
		fontWeight: 600,
		textTransform: 'uppercase',
		letterSpacing: '0.07em',
		color: theme.palette.text.disabled,
		marginBottom: theme.spacing(1)
	})),

	TaskModalDescriptionBody: styled(Box)(() => ({
		maxHeight: 160,
		overflowY: 'auto',
		'&::-webkit-scrollbar': { width: 4 },
		'&::-webkit-scrollbar-track': { background: 'transparent' },
		'&::-webkit-scrollbar-thumb': {
			background: 'rgba(0,0,0,0.15)',
			borderRadius: 4
		}
	})),

	TaskModalDescriptionText: styled(Typography)(({ theme }) => ({
		fontSize: 14,
		lineHeight: 1.65,
		color: theme.palette.text.primary
	})),

	TaskModalInfoRow: styled(Box)(({ theme }) => ({
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing(1),
		'&:not(:last-of-type)': { marginBottom: theme.spacing(1.25) }
	})),

	TaskModalInfoLabel: styled(Typography)(({ theme }) => ({
		fontSize: 13,
		color: theme.palette.text.secondary,
		minWidth: 110,
		flexShrink: 0
	})),

	TaskModalInfoAvatar: styled('div')<{ variant?: 'primary' | 'secondary' }>(({ theme, variant }) => ({
		width: 22,
		height: 22,
		borderRadius: '50%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontSize: 10,
		fontWeight: 600,
		flexShrink: 0,
		backgroundColor: variant === 'secondary' ? theme.palette.warning.light : theme.palette.info.light,
		color: variant === 'secondary' ? theme.palette.warning.dark : theme.palette.info.dark
	})),

	TaskModalInfoValue: styled(Typography)(({ theme }) => ({
		fontSize: 13,
		color: theme.palette.text.primary
	})),

	TaskModalActions: styled(Box)(({ theme }) => ({
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
		gap: theme.spacing(1),
		padding: theme.spacing(1.5, 2.5)
	})),

	FooterSection: styled(Box)(({ theme }) => ({
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		paddingTop: theme.spacing(1),
		gap: theme.spacing(2)
	})),

	GoToTasksIcon: styled(DoubleArrowIcon)(({ theme }) => ({
		marginLeft: theme.spacing(1)
	})),

	GoToTasksButton: styled(Button)(() => ({
		width: 240,
		height: 52,
		borderRadius: 8,
		backgroundColor: '#E0E0E0',
		color: '#333333',
		fontWeight: 'bold',
		fontSize: 16,
		textTransform: 'none',
		boxShadow: 'none',
		'&:hover': { backgroundColor: '#D0D0D0', boxShadow: 'none' },
		'&:active': { backgroundColor: '#C0C0C0' }
	})),

	PaginationContainer: styled(Box)(({ theme }) => ({
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: theme.spacing(1)
	})),

	PaginationButton: styled(Button)(() => ({
		minWidth: 0,
		width: 36,
		height: 36,
		borderRadius: 18,
		padding: 0,
		backgroundColor: '#333333',
		color: '#B0B0B0',
		'&:hover': { backgroundColor: '#000000' }
	}))
};

export default HomeStyles;