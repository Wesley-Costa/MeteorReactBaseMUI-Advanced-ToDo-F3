import { IDoc } from '../../../typings/IDoc';
import { ISchema } from '../../../typings/ISchema';

export type ToDoStatus = 'open' | 'completed';
export interface ITask extends IDoc {
	title: string;
	description?: string;
	createdBy?: string;
	createdAt?: Date;
	updatedAt?: Date;
	authorName?: string;
	assignedTo?: string;
	assignedToName?: string;
	status: 'open' | 'completed';
	personal: boolean;
}

export const tasksSch: ISchema<ITask> = {
	title: {
		type: String,
		label: 'Título',
		defaultValue: '',
		optional: false
	},
	description: {
		type: String,
		label: 'Descrição',
		defaultValue: '',
		optional: false
	},
	createdBy: {
		type: String,
		label: 'Criado por',
		defaultValue: '',
		optional: true
	},
	authorName: {
		type: String,
		label: 'Nome do autor',
		defaultValue: '',
		optional: true
	},
	createdAt: {
		type: Date,
		label: 'Criado em',
		defaultValue: new Date(),
		optional: true
	},
	assignedTo: {
		type: String,
		label: 'Atribuído a',
		defaultValue: '',
		optional: true
	},
	assignedToName: {
		type: String,
		label: 'Nome do usuário atribuído',
		defaultValue: '',
		optional: true
	},
	updatedAt: {
		type: Date,
		label: 'Alterado em',
		defaultValue: new Date(),
		optional: true
	},
	status: {
		type: String,
		label: 'Status',
		defaultValue: '',
		optional: false,
		options: () => [
      { value: 'open', label: 'Não concluída' },
      { value: 'completed', label: 'Concluída' },
    ]
	},
	personal: {
    type: Boolean,
    label: 'Pessoal',
    defaultValue: false,
    optional: false,
  },
};
