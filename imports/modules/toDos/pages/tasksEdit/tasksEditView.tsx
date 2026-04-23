import React, { useContext } from 'react';
import { Typography, IconButton } from '@mui/material';
import { TasksEditControllerContext } from './tasksEditController';
import TasksEditStyles from './tasksEditStyles';
import SysIcon from '../../../../ui/components/sysIcon/sysIcon';
import SysForm from '../../../../ui/components/sysForm/sysForm';
import SysTextField from '../../../../ui/components/sysFormFields/sysTextField/sysTextField';
import { SysSelectField } from '../../../../ui/components/sysFormFields/sysSelectField/sysSelectField';
import SysFormButton from '../../../../ui/components/sysFormFields/sysFormButton/sysFormButton';
import SysSwitch from '../../../../ui/components/sysFormFields/sysSwitch/sysSwitch';
import { SysButton } from '../../../../ui/components/SimpleFormFields/SysButton/SysButton';

const { Container, Header, Body, FormColumn, InlineRow, Footer } = TasksEditStyles;

const TasksEditView = () => {
	const controller = useContext(TasksEditControllerContext);

	return (
		<Container>
			<Header>
				<IconButton onClick={controller.closePage} aria-label="Voltar">
					<SysIcon name="arrowBack" />
				</IconButton>
				<Typography variant="h6" sx={{ fontWeight: 500 }}>
					Editar Tarefa
				</Typography>
			</Header>

			<SysForm
				mode="edit"
				schema={controller.schema}
				doc={controller.document}
				onSubmit={controller.onSubmit}
				loading={controller.loading}>
				<Body>
					<FormColumn>
						<SysTextField name="title" placeholder="Título da tarefa" />
						<SysTextField name="description" placeholder="Descrição da tarefa" multiline rows={4} />
						<InlineRow>
							<SysSelectField name="status" placeholder="Selecione o status" />
							<SysSwitch name="personal" label="Tarefa pessoal?" valueLabel="Pessoal" />
						</InlineRow>
					</FormColumn>
				</Body>

				<Footer>
					<SysButton
						variant="outlined"
						startIcon={<SysIcon name="close" />}
						onClick={controller.closePage}>
						Cancelar
					</SysButton>
					<SysFormButton>Salvar</SysFormButton>
				</Footer>
			</SysForm>
		</Container>
	);
};

export default TasksEditView;