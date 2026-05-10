import React from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { sysSizing } from '../../../ui/materialui/styles';

interface ISignUpStyles {
	Container: React.ElementType;
	Content: React.ElementType;
	FormContainer: React.ElementType;
	FormWrapper: React.ElementType;
	PasswordStrengthBar: React.ElementType;
	PasswordStrengthWrapper: React.ElementType;
	PasswordStrengthLabel: React.ElementType;
	PasswordHint: React.ElementType;
	Title: React.ElementType;
	TitleBracket: React.ElementType;
	Logo: React.ElementType;
	LinkButtonEnd: React.ElementType;
}

const SignUpStyles: ISignUpStyles = {
	Container: styled(Box)(({ theme }) => ({
		minHeight: '100vh',
		width: '100%',
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
		position: 'relative',
		[theme.breakpoints.up('md')]: {
			backgroundImage: 'url(/images/wireframe/background-synergia.svg)',
			backgroundSize: 'cover',
			backgroundPosition: 'right'
		}
	})),

	Content: styled(Box)(({ theme }) => ({
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		gap: theme.spacing(6),
		padding: `${sysSizing.spacingFixedLg} ${sysSizing.spacingFixedXl}`,
		[theme.breakpoints.up('md')]: {
			width: 'auto',
			height: 'auto',
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)'
		}
	})),

	FormContainer: styled(Paper)(({ theme }) => ({
		width: '100%',
		padding: `${sysSizing.spacingFixedLg} ${sysSizing.spacingFixedXl}`,
		borderRadius: sysSizing.radiusLg,
		boxShadow: theme.shadows[3],
		gap: sysSizing.spacingFixedXl,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
		maxWidth: '400px'
	})),

	FormWrapper: styled(Box)(({ theme }) => ({
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		gap: theme.spacing(2)
	})),

	PasswordStrengthBar: styled(Box, {
		shouldForwardProp: (prop) => prop !== 'strength'
	})(({ theme, strength }: any) => ({
		width: '100%',
		height: 4,
		borderRadius: 2,
		backgroundColor: theme.palette.grey[300],
		position: 'relative',
		'&::after': {
			content: '""',
			position: 'absolute',
			top: 0,
			left: 0,
			height: '100%',
			borderRadius: 2,
			width: `${((strength as number) / 5) * 100}%`,
			backgroundColor:
				strength <= 1
					? theme.palette.error.main
					: strength <= 2
						? theme.palette.warning.main
						: strength <= 3
							? theme.palette.info.main
							: theme.palette.success.main,
			transition: 'width 0.3s ease, background-color 0.3s ease'
		}
	})),

	PasswordStrengthWrapper: styled(Box)(({ theme }) => ({
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing(0.5)
	})),

	PasswordStrengthLabel: styled(Typography)(() => ({
		alignSelf: 'flex-end'
	})),

	PasswordHint: styled(Typography)(() => ({
		color: 'text.secondary'
	})),

	Title: styled(Typography)(() => ({
		display: 'inline-flex',
		gap: '8px'
	})),

	TitleBracket: styled(Typography)(({ theme }) => ({
		color: (theme.palette as any).sysText?.tertiary
	})),

	Logo: styled(Box)(() => ({
		width: '100%',
		maxWidth: '400px'
	})),

	LinkButtonEnd: styled(Button)(() => ({
		alignSelf: 'flex-end'
	}))
};

export default SignUpStyles;
