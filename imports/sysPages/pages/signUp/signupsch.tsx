	import { validarEmail } from '../../../libs/validaEmail';
	import { IDoc } from '../../../typings/IDoc';
	import { ISchema } from '../../../typings/ISchema';

	export const signUpSchema: ISchema<ISignUp> = {
		username: {
			type: 'String',
			label: 'Nome',
			optional: false,
			defaultValue: '',
		},
		email: {
			type: 'String',
			label: 'Email',
			optional: false,
			defaultValue: '',
			validationFunction: (value: string) => {
				if (!value) return undefined;
				const email = validarEmail(value);
				if (!email) return 'Email inválido';
				return undefined;
			}
		},
		password: {
			type: 'String',
			label: 'Senha',
			optional: false,
			min: 8,
			defaultValue: ''
		},
		confirmPassword: {
			type: 'String',
			label: 'Confirmar Senha',
			optional: false,
			defaultValue: ''
		}
	};

	export interface ISignUp extends IDoc {
		username: string;
		email: string;
		password: string;
		confirmPassword: string;
	}