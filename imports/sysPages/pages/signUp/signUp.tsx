import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SysForm from '../../../ui/components/sysForm/sysForm';
import SysTextField from '../../../ui/components/sysFormFields/sysTextField/sysTextField';
import SysFormButton from '../../../ui/components/sysFormFields/sysFormButton/sysFormButton';
import SysIcon from '../../../ui/components/sysIcon/sysIcon';
import AuthContext, { IAuthContext } from '/imports/app/authProvider/authContext';
import AppLayoutContext from '/imports/app/appLayoutProvider/appLayoutContext';
import { userprofileApi } from '../../../modules/userprofile/api/userProfileApi';
import { signUpSchema } from './signupsch';
import SignUpStyles from './signUpStyle';
import { IMeteorError } from '/imports/typings/BoilerplateDefaultTypings';

const getPasswordStrength = (password: string): number => {
	if (!password) return 0;
	let score = 0;
	if (password.length >= 8) score++;
	if (password.length >= 12) score++;
	if (/[A-Z]/.test(password)) score++;
	if (/[0-9]/.test(password)) score++;
	if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
	return score;
};

const getPasswordStrengthLabel = (strength: number): { label: string; color: string } => {
	if (strength === 0) return { label: '', color: 'transparent' };
	if (strength <= 1) return { label: 'Muito fraca', color: 'error.main' };
	if (strength <= 2) return { label: 'Fraca', color: 'warning.main' };
	if (strength <= 3) return { label: 'Média', color: 'info.main' };
	if (strength <= 4) return { label: 'Forte', color: 'success.main' };
	return { label: 'Muito forte', color: 'success.main' };
};

const SignUpPage: React.FC = () => {
	const { showNotification } = useContext(AppLayoutContext);
	const { user } = useContext<IAuthContext>(AuthContext);
	const navigate = useNavigate();
	const [passwordValue, setPasswordValue] = useState('');
	const [confirmError, setConfirmError] = useState<string | undefined>(undefined);
	const strength = getPasswordStrength(passwordValue);
	const strengthInfo = getPasswordStrengthLabel(strength);

	const { Container, Content, FormContainer, FormWrapper, PasswordStrengthBar } = SignUpStyles;

	useEffect(() => {
		if (user) navigate('/');
	}, [user]);

	const handleSubmit = (doc: { username: string; email: string; password: string; confirmPassword: string }) => {
		const { email, username, password, confirmPassword } = doc;

		if (password !== confirmPassword) {
			setConfirmError('As senhas não coincidem.');
			return;
		}

		setConfirmError(undefined);

		userprofileApi.insertNewUser({ email, username, password }, (err: IMeteorError | null) => {
			if (err) {
				console.error('SignUp error:', err);
				showNotification({
					type: 'error',
					title: 'Erro ao criar conta',
					message: err.reason || err.message || 'Não foi possível realizar o cadastro. Tente novamente.',
					showCloseButton: true,
				});
			} else {
				showNotification({
					type: 'success',
					title: 'Cadastro realizado!',
					message: 'Sua conta foi criada com sucesso. Verifique seu email para ativá-la.',
					showCloseButton: true,
				});
				navigate('/signin');
			}
		});
	};

	const handleSignIn = () => navigate('/signin');

	return (
		<Container>
			<Content>
				<Typography variant="h1" display="inline-flex" gap={1}>
					<Typography variant="inherit" color={(theme) => theme.palette.sysText?.tertiary}>
						{'{'}
					</Typography>
					ToDo List 
					<Typography variant="inherit" color="sysText.tertiary">
						{'}'}
					</Typography>
				</Typography>

				<FormContainer>
					<Typography variant="h5">Criar conta</Typography>

					<SysForm schema={signUpSchema} onSubmit={handleSubmit} debugAlerts={false}>
						<FormWrapper>
							<SysTextField
								name="username"
								label="Nome"
								fullWidth
								placeholder="Digite seu nome"
							/>

							<SysTextField
								name="email"
								label="Email"
								fullWidth
								placeholder="Digite seu email"
								type="email"
							/>

							<SysTextField
								name="password"
								label="Senha"
								fullWidth
								placeholder="Digite sua senha"
								type="password"
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
									setPasswordValue(e.target.value);
									if (confirmError) setConfirmError(undefined);
								}}
							/>

							{passwordValue.length > 0 && (
								<Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
									<PasswordStrengthBar strength={strength} />
									<Typography variant="caption" color={strengthInfo.color} alignSelf="flex-end">
										{strengthInfo.label}
									</Typography>
									<Typography variant="caption" color="text.secondary">
										Use 8+ caracteres, letras maiúsculas, minúsculas, números e símbolos.
									</Typography>
								</Box>
							)}

							<SysTextField
								name="confirmPassword"
								label="Confirmar Senha"
								fullWidth
								placeholder="Repita sua senha"
								type="password"
								error={!!confirmError}
								helperText={confirmError}
								onChange={() => {
									if (confirmError) setConfirmError(undefined);
								}}
							/>

							<Button variant="text" sx={{ alignSelf: 'flex-end' }} onClick={handleSignIn}>
								<Typography variant="link">Já tenho uma conta</Typography>
							</Button>

							<Box />

							<SysFormButton variant="contained" color="primary" endIcon={<SysIcon name="arrowForward" />}>
								Cadastrar
							</SysFormButton>
						</FormWrapper>
					</SysForm>
				</FormContainer>

				<Box component="img" src="/images/wireframe/synergia-logo.svg" sx={{ width: '100%', maxWidth: '400px' }} />
			</Content>
		</Container>
	);
};

export default SignUpPage;