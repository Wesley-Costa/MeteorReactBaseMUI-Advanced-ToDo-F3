import { ProductServerBase } from '../../../api/productServerBase';
import { tasksSch, ITask } from './tasksSch';
import { Recurso } from '../config/recursos';
import { IContext } from '../../../typings/IContext';
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { escapeRegExp } from 'lodash';
import { EnumUserRoles } from '/imports/modules/userprofile/api/enumUser';
import { userprofileServerApi } from '/imports/modules/userprofile/api/userProfileServerApi';

class TasksServerApi extends ProductServerBase<ITask> {
	constructor() {
		super('tasks', tasksSch, { resources: Recurso });
		const self = this;

		this.addPublication('recent', function (this: any) {
			const userId = this.userId;

			if (!userId) {
				return self.getCollectionInstance().find({ _id: 'EMPTY' });
			}

			const filter = {
				$or: [{ personal: { $ne: true } }, { createdBy: userId }, { assignedTo: userId }]
			};

			return self.defaultListCollectionPublication(filter, {
				sort: { updatedAt: -1 },
				limit: 5,
				projection: {
					title: 1,
					description: 1,
					createdAt: 1,
					updatedAt: 1,
					createdBy: 1,
					authorName: 1,
					assignedTo: 1,
					assignedToName: 1,
					status: 1,
					personal: 1
				}
			});
		});

		this.addPublication('list', function (this: any, search = '', filter = {}, options = {}) {
			const userId = this.userId;

			if (!userId) {
				return self.getCollectionInstance().find({ _id: 'EMPTY' });
			}

			try {
				check(search, String);
				check(filter, {
					status: Match.OneOf('open', 'completed')
				});
				check(options, {
					skip: Match.Maybe(Match.Integer),
					limit: Match.Maybe(Match.Integer)
				});
			} catch {
				return self.getCollectionInstance().find({ _id: 'EMPTY' });
			}

			const safeSkip = Math.max(
				0,
				Math.min(typeof (options as any).skip === 'number' ? (options as any).skip : 0, 10000)
			);
			const safeLimit = Math.max(
				1,
				Math.min(typeof (options as any).limit === 'number' ? (options as any).limit : 5, 11)
			);

			const visibilityFilter = {
				$or: [{ personal: { $ne: true } }, { createdBy: userId }, { assignedTo: userId }]
			};

			const searchTerm = search.trim();
			const searchFilter =
				searchTerm.length > 0
					? {
							$or: [
								{ title: { $regex: escapeRegExp(searchTerm), $options: 'i' } },
								{ description: { $regex: escapeRegExp(searchTerm), $options: 'i' } }
							]
						}
					: null;

			const andConditions: object[] = [filter, visibilityFilter];
			if (searchFilter) andConditions.push(searchFilter);

			return self.defaultListCollectionPublication(
				{ $and: andConditions },
				{
					sort: { updatedAt: -1 },
					skip: safeSkip,
					limit: safeLimit,
					projection: {
						title: 1,
						description: 1,
						createdAt: 1,
						updatedAt: 1,
						createdBy: 1,
						authorName: 1,
						assignedTo: 1,
						assignedToName: 1,
						status: 1,
						personal: 1
					}
				}
			);
		});

		this.addPublication('edit', async function (this: any, filter = {}) {
			const userId = this.userId;

			if (!userId) {
				return self.getCollectionInstance().find({ _id: 'EMPTY' });
			}

			try {
				check(filter, { _id: String });
			} catch {
				return self.getCollectionInstance().find({ _id: 'EMPTY' });
			}

			const userProfile = await userprofileServerApi.getCollectionInstance().findOneAsync({ _id: userId });

			const roles: string[] = (userProfile as any)?.roles ?? [];
			const isAdmin = roles.includes(EnumUserRoles.ADMINISTRADOR);

			const permissionFilter = isAdmin ? filter : { ...filter, $or: [{ createdBy: userId }, { assignedTo: userId }] };

			return self.defaultDetailCollectionPublication(permissionFilter, {
				projection: {
					title: 1,
					description: 1,
					createdAt: 1,
					updatedAt: 1,
					createdBy: 1,
					authorName: 1,
					assignedTo: 1,
					assignedToName: 1,
					status: 1,
					personal: 1
				}
			});
		});
	}

	private async isAdminUser(userId: string): Promise<boolean> {
		const userProfile = await userprofileServerApi.getCollectionInstance().findOneAsync({ _id: userId });

		const roles: string[] = (userProfile as any)?.roles ?? [];
		return roles.includes(EnumUserRoles.ADMINISTRADOR);
	}

	async beforeInsert(_docObj: Partial<ITask>, _context: IContext): Promise<boolean> {
		const userId = _context.user?._id;

		if (!userId) {
			throw new Meteor.Error('forbidden', 'Você precisa estar autenticado para realizar esta ação.');
		}

		const userProfile = await userprofileServerApi.getCollectionInstance().findOneAsync({ _id: userId });

		_docObj.createdBy = userId;
		_docObj.authorName = (userProfile as any)?.username;

		if (_docObj.assignedTo) {
			const assignedProfile = await userprofileServerApi
				.getCollectionInstance()
				.findOneAsync({ _id: _docObj.assignedTo });

			if (!assignedProfile) {
				throw new Meteor.Error('invalid-user', 'Usuário atribuído não encontrado.');
			}
			_docObj.assignedToName = (assignedProfile as any)?.username;
		} else {
			_docObj.assignedToName = undefined;
		}

		return super.beforeInsert(_docObj, _context);
	}

	async beforeUpdate(_docObj: Partial<ITask>, _context: IContext): Promise<boolean> {
		const userId = _context.user?._id;

		if (!userId) {
			throw new Meteor.Error('forbidden', 'Você precisa estar autenticado para realizar esta ação.');
		}

		if (!_docObj._id) {
			throw new Meteor.Error('invalid-id', 'Identificador de tarefa inválido.');
		}

		const existingDoc = await this.getCollectionInstance().findOneAsync({ _id: _docObj._id });

		if (!existingDoc) {
			throw new Meteor.Error('not-found', 'Tarefa não encontrada.');
		}

		const isAdmin = await this.isAdminUser(userId);
		if (!isAdmin && existingDoc.createdBy && existingDoc.createdBy !== userId) {
			throw new Meteor.Error('forbidden', 'Somente o criador ou administrador podem alterar esta tarefa.');
		}

		_docObj.createdBy = existingDoc.createdBy;
		_docObj.authorName = existingDoc.authorName;

		if (_docObj.assignedTo && _docObj.assignedTo !== existingDoc.assignedTo) {
			const assignedProfile = await userprofileServerApi
				.getCollectionInstance()
				.findOneAsync({ _id: _docObj.assignedTo });

			if (!assignedProfile) {
				throw new Meteor.Error('invalid-user', 'Usuário atribuído não encontrado.');
			}
			_docObj.assignedToName = (assignedProfile as any)?.name || (assignedProfile as any)?.username || 'Desconhecido';
		} else if (!_docObj.assignedTo) {
			_docObj.assignedToName = undefined;
		} else {
			_docObj.assignedToName = existingDoc.assignedToName;
		}

		return super.beforeUpdate(_docObj, _context);
	}

	async beforeRemove(_docObj: Partial<ITask>, _context: IContext): Promise<boolean> {
		const userId = _context.user?._id;

		if (!userId) {
			throw new Meteor.Error('forbidden', 'Você precisa estar autenticado para realizar esta ação.');
		}

		if (!_docObj._id) {
			throw new Meteor.Error('invalid-id', 'Identificador de tarefa inválido.');
		}

		const existingDoc = await this.getCollectionInstance().findOneAsync({ _id: _docObj._id });

		if (!existingDoc) {
			throw new Meteor.Error('not-found', 'Tarefa não encontrada.');
		}

		const isAdmin = await this.isAdminUser(userId);
		if (!isAdmin && existingDoc.createdBy && existingDoc.createdBy !== userId) {
			throw new Meteor.Error('forbidden', 'Somente o criador ou administrador podem remover esta tarefa.');
		}

		return super.beforeRemove(_docObj, _context);
	}
}

export const tasksServerApi = new TasksServerApi();
