import React, { useContext, useEffect } from 'react';
import SignInStyles from './signInStyles';
import { useNavigate } from 'react-router-dom';
import SysTextField from '../../../ui/components/sysFormFields/sysTextField/sysTextField';
import SysForm from '../../../ui/components/sysForm/sysForm';
import SysFormButton from '../../../ui/components/sysFormFields/sysFormButton/sysFormButton';
import { signInSchema } from './signinsch';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SysIcon from '../../../ui/components/sysIcon/sysIcon';
import AuthContext, { IAuthContext } from '/imports/app/authProvider/authContext';
import AppLayoutContext from '/imports/app/appLayoutProvider/appLayoutContext';

const SignInPage: React.FC = () => {
	const { showNotification } = useContext(AppLayoutContext);
	const { user, signIn } = useContext<IAuthContext>(AuthContext);
	const navigate = useNavigate();
	const { Container, Content, FormContainer, FormWrapper, Title, TitleBracket, Logo, LinkButton } = SignInStyles;

	const handleSubmit = ({ email, password }: { email: string; password: string }) => {
		signIn(email, password, (err) => {
			if (!err) {
				navigate('/');
				return;
			}
			showNotification({
				type: 'error',
				title: 'Erro ao tentar logar',
				message: 'Email ou senha inválidos',
				showCloseButton: true
			});
		});
	};

	const handleForgotPassword = () => navigate('/password-recovery');

	const handleSignUp = () => navigate('/signup');

	useEffect(() => {
		if (user) navigate('/');
	}, [user]);

	return (
		<Container>
			<Content>
				<Title variant="h1">
					<TitleBracket variant="inherit">{'{'}</TitleBracket>
					ToDo List
					<TitleBracket variant="inherit">{'}'}</TitleBracket>
				</Title>

				<FormContainer>
					<Typography variant="body2" align="center" sx={{ fontSize: '0.95rem' }}>
						Boas-vindas a sua lista de tarefas.
						<br />
						Insira seu e-mail e senha para efetuar o login:
					</Typography>
					<SysForm schema={signInSchema} onSubmit={handleSubmit} debugAlerts={false}>
						<FormWrapper>
							<SysTextField name="email" label="Email" fullWidth placeholder="Digite seu email" />
							<SysTextField label="Senha" fullWidth name="password" placeholder="Digite sua senha" type="password" />
							<SysFormButton variant="contained" color="primary" endIcon={<SysIcon name={'arrowForward'} />}>
								Entrar
							</SysFormButton>
							<LinkButton variant="text" onClick={handleSignUp}>
								<Typography variant="link">Novo por aqui? Cadastre-se</Typography>
							</LinkButton>
							<LinkButton variant="text" onClick={handleForgotPassword}>
								<Typography variant="link">Esqueceu a senha? Clique aqui</Typography>
							</LinkButton>
							<Box />
						</FormWrapper>
					</SysForm>
				</FormContainer>

				<Logo component="img" src="/images/wireframe/synergia-logo.svg" />
			</Content>
		</Container>
	);
};

export default SignInPage;
