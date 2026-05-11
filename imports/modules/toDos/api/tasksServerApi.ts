import { ProductServerBase } from '../../../api/productServerBase';
import { tasksSch, ITask } from './tasksSch';
import { Recurso } from '../config/recursos';
import { IContext } from '../../../typings/IContext';
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { escapeRegExp } from 'lodash';
import { EnumUserRoles } from '/imports/modules/userprofile/api/enumUser';
import { userprofileServerApi } from '/imports/modules/userprofile/api/userProfileServerApi';

const TASK_PROJECTION = {
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
} as const;

const visibilityFilter = (userId: string) => ({
	$or: [{ personal: { $ne: true } }, { createdBy: userId }, { assignedTo: userId }]
});

const resolveDisplayName = (profile: any): string => profile?.username || 'Desconhecido';

class TasksServerApi extends ProductServerBase<ITask> {
	constructor() {
		super('tasks', tasksSch, { resources: Recurso });
		const self = this;

		this.addPublication('recent', function (this: any) {
			const userId = this.userId;
			if (!userId) return self.getCollectionInstance().find({ _id: 'EMPTY' });

			return self.defaultListCollectionPublication(visibilityFilter(userId), {
				sort: { updatedAt: -1 },
				limit: 5,
				projection: TASK_PROJECTION
			});
		});

		this.addPublication('list', function (this: any, search = '', filter = {}, options = {}) {
			const userId = this.userId;
			if (!userId) return self.getCollectionInstance().find({ _id: 'EMPTY' });

			try {
				check(search, String);
				check(filter, { status: Match.OneOf('open', 'completed') });
				check(options, {
					skip: Match.Maybe(Match.Integer),
					limit: Match.Maybe(Match.Integer)
				});
			} catch {
				return self.getCollectionInstance().find({ _id: 'EMPTY' });
			}

			let { skip = 0, limit = 4 } = options as { skip?: number; limit?: number };
			skip = Math.max(0, skip);
			limit = Math.min(5, Math.max(1, limit));

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

			const andConditions: object[] = [filter, visibilityFilter(userId)];
			if (searchFilter) andConditions.push(searchFilter);

			return self.defaultListCollectionPublication(
				{ $and: andConditions },
				{
					sort: { updatedAt: -1 },
					skip: skip,
					limit: limit,
					projection: TASK_PROJECTION
				}
			);
		});

		this.addPublication('edit', function (this: any, filter = {}) {
			const userId = this.userId;
			if (!userId) return self.getCollectionInstance().find({ _id: 'EMPTY' });

			try {
				check(filter, { _id: String });
			} catch {
				return self.getCollectionInstance().find({ _id: 'EMPTY' });
			}

			const userProfile = userprofileServerApi.getCollectionInstance().findOne({ _id: userId });
			const roles: string[] = (userProfile as any)?.roles ?? [];
			const isAdmin = roles.includes(EnumUserRoles.ADMINISTRADOR);

			const permissionFilter = isAdmin ? filter : { ...filter, $or: [{ createdBy: userId }, { assignedTo: userId }] };

			return self.defaultDetailCollectionPublication(permissionFilter, {
				projection: TASK_PROJECTION
			});
		});

		this.registerMethod('canActOnTask', this.canActOnTask.bind(this));
	}

	private async isOwnerOrAdmin(taskId: string, userId: string): Promise<boolean> {
		const [task, userProfile] = await Promise.all([
			this.getCollectionInstance().findOneAsync({ _id: taskId }),
			userprofileServerApi.getCollectionInstance().findOneAsync({ _id: userId })
		]);

		if (!task) return false;

		const isOwner = task.createdBy === userId;
		const roles: string[] = (userProfile as any)?.roles ?? [];
		const isAdmin = roles.includes(EnumUserRoles.ADMINISTRADOR);

		return isAdmin || isOwner;
	}

	protected async canActOnTask(params: { taskId: string }, context: IContext): Promise<boolean> {
		const userId = context.user?._id;
		if (!userId) return false;

		check(params.taskId, String);
		return this.isOwnerOrAdmin(params.taskId, userId);
	}

	async beforeInsert(_docObj: Partial<ITask>, _context: IContext): Promise<boolean> {
		const userId = _context.user?._id;
		if (!userId) {
			throw new Meteor.Error('forbidden', 'Você precisa estar autenticado para realizar esta ação.');
		}

		const userProfile = await userprofileServerApi.getCollectionInstance().findOneAsync({ _id: userId });

		_docObj.createdBy = userId;
		_docObj.authorName = resolveDisplayName(userProfile);

		if (_docObj.assignedTo) {
			const assignedProfile = await userprofileServerApi
				.getCollectionInstance()
				.findOneAsync({ _id: _docObj.assignedTo });

			if (!assignedProfile) {
				throw new Meteor.Error('invalid-user', 'Usuário atribuído não encontrado.');
			}
			_docObj.assignedToName = resolveDisplayName(assignedProfile);
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

		const canEdit = await this.isOwnerOrAdmin(_docObj._id, userId);
		if (!canEdit) {
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
			_docObj.assignedToName = resolveDisplayName(assignedProfile);
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

		const canDelete = await this.isOwnerOrAdmin(_docObj._id, userId);
		if (!canDelete) {
			throw new Meteor.Error('forbidden', 'Somente o criador ou administrador podem remover esta tarefa.');
		}

		return super.beforeRemove(_docObj, _context);
	}
}

export const tasksServerApi = new TasksServerApi();
