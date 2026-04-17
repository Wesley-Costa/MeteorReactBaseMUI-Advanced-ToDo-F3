import { Recurso as Usuarios } from '/imports/modules/userprofile/config/recurso';
import { Recurso as Tasks } from '../../modules/toDos/config/recursos';
import { RoleType } from '/imports/security/config/roleType';
import { HomeResources, SysFormTestPageResources } from '/imports/sysPages/config/resources';

const _getAllValues = (obj: any) => Object.keys(obj).map(key => obj[key]);

type MapRolesRecursos = Record<RoleType, Array<string>>; 

const _mapRolesRecursos: MapRolesRecursos = {
	[RoleType.PUBLICO]: [],
	[RoleType.USUARIO]: [
		..._getAllValues(HomeResources),
		..._getAllValues(SysFormTestPageResources),
		Usuarios.USUARIO_UPDATE,
		Usuarios.USUARIO_VIEW,
		Tasks.TASKS_VIEW,
		Tasks.TASKS_CREATE
	],
	[RoleType.ADMINISTRADOR]: [
		Usuarios.USUARIO_CREATE,
		Usuarios.USUARIO_REMOVE,
		Tasks.TASKS_REMOVE,
		Tasks.TASKS_UPDATE
	],
};

/**
 * Mapeamento entre as roles (perfil de usuário) e os recursos.
 * chave: role.
 * valores: recursos.
 *
 *
 * O nome do recurso deve ser prefixado com nome do módulo.
 */
export const mapRolesRecursos: MapRolesRecursos = {
	[RoleType.PUBLICO]: [
		..._mapRolesRecursos[RoleType.PUBLICO],
	],
	[RoleType.USUARIO]: [
		..._mapRolesRecursos[RoleType.PUBLICO],
		..._mapRolesRecursos[RoleType.USUARIO],
	],
	[RoleType.ADMINISTRADOR]: [
		..._mapRolesRecursos[RoleType.PUBLICO],
		..._mapRolesRecursos[RoleType.USUARIO],
		..._mapRolesRecursos[RoleType.ADMINISTRADOR],
	],
};