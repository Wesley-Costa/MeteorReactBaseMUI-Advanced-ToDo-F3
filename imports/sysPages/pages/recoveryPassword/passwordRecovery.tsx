import React, { useContext } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import TextField from '/imports/ui/components/SimpleFormFields/TextField/TextField';
import Button from '@mui/material/Button';
import SimpleForm from '/imports/ui/components/SimpleForm/SimpleForm';
import { IDefaultContainerProps } from '/imports/typings/BoilerplateDefaultTypings';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SignInStyles from '../signIn/signInStyles';
import { useNavigate } from 'react-router-dom';
import { sysSizing } from '/imports/ui/materialui/styles';
import SysIcon from '/imports/ui/components/sysIcon/sysIcon';
import AppLayoutContext from '/imports/app/appLayoutProvider/appLayoutContext';

export const PasswordRecovery = (props: IDefaultContainerProps) => {
	const [loading, setLoading] = React.useState<boolean>(false);
	const [msg, setMsg] = React.useState<boolean>(false);

	const { showNotification } = useContext(AppLayoutContext);
	const navigate = useNavigate();
	const { Container, Content, FormContainer, FormWrapper, Title, TitleBracket, Logo, DescriptionText } = SignInStyles;

	const handleSubmit = (doc: { email: string }) => {
		const { email } = doc;
		setLoading(true);
		Accounts.forgotPassword({ email }, (err?: Meteor.Error | Error | undefined) => {
			if (err) {
				if (err.message === 'User not found [403]') {
					showNotification &&
						showNotification({
							type: 'warning',
							title: 'Problema na recuperação da senha!',
							message: 'Este email não está cadastrado em nossa base de dados!'
						});
					setLoading(false);
				} else {
					showNotification &&
						showNotification({
							type: 'warning',
							title: 'Problema na recuperação da senha!',
							message: 'Erro ao recriar a senha, faça contato com o administrador!!'
						});
					setLoading(false);
				}
			} else {
				showNotification &&
					showNotification({
						type: 'success',
						title: 'Senha enviada!',
						message: 'Acesse seu email e clique no link para criar uma nova senha.'
					});
				setLoading(false);
				setMsg((prev) => !prev);
			}
		});
	};

	const schema = {
		email: {
			type: 'String',
			label: 'Email',
			optional: false
		}
	};

	return (
		<Container>
			<Content>
				<Title variant="h1">
					<TitleBracket variant="inherit">{'{'}</TitleBracket>
					ToDo List
					<TitleBracket variant="inherit">{'}'}</TitleBracket>
				</Title>

				<FormContainer>
					<Typography variant="h5" color={(theme: any) => theme.palette.sysText?.title}>
						{!msg ? 'Esqueceu sua senha?' : 'Agora é só aguardar!'}
					</Typography>

					<DescriptionText variant="body1" color={(theme: any) => theme.palette.sysText?.body}>
						{!msg
							? 'Confirme seu e-mail abaixo para receber um link de redefinição da sua senha'
							: 'Caso o e-mail informado esteja cadastrado no sistema, enviaremos um link para a redefinição de sua senha'}
					</DescriptionText>

					<SimpleForm schema={schema} onSubmit={handleSubmit} styles={{ display: !msg ? 'block' : 'none' }}>
						<FormWrapper>
							<TextField
								label="Email"
								fullWidth={true}
								name="email"
								type="email"
								placeholder="Digite seu email"
								disabled={loading}
							/>
							<Box />
							<Box sx={{ display: 'flex', gap: sysSizing.spacingFixedMd }}>
								<Button
									onClick={() => navigate('/')}
									variant="outlined"
									color="primary"
									id="cancelar"
									disabled={loading}
									startIcon={<SysIcon name={'close'} />}
									sx={{ transition: 'all 0.3s ease' }}>
									{loading ? <CircularProgress size={24} /> : 'Cancelar'}
								</Button>
								<Button
									variant="contained"
									color="primary"
									id="submit"
									startIcon={<SysIcon name={'check'} />}
									sx={{ transition: 'all 0.3s ease', display: loading ? 'none' : 'flex' }}>
									{loading ? <CircularProgress size={24} /> : 'Confirmar'}
								</Button>
							</Box>
						</FormWrapper>
					</SimpleForm>

					<Button
						onClick={() => navigate('/')}
						variant="contained"
						color="primary"
						id="cancelar"
						startIcon={<SysIcon name={'arrowBack'} />}
						sx={{ transition: 'all 0.3s ease', display: !msg ? 'none' : 'flex' }}>
						{loading ? <CircularProgress size={24} /> : 'Voltar para o Login'}
					</Button>
				</FormContainer>

				<Logo component="img" src="/images/wireframe/synergia-logo.svg" />
			</Content>
		</Container>
	);
};
