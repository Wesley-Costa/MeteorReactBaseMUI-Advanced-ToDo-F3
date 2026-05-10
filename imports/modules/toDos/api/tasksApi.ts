import { ProductBase } from '../../../api/productBase';
import { tasksSch, ITask } from './tasksSch';
import { Meteor } from 'meteor/meteor';
import { RoleType } from '../../../security/config/roleType';
import { getUser } from '/imports/libs/getUser';
import { EnumUserRoles } from '/imports/modules/userprofile/api/enumUser';

class TasksApi extends ProductBase<ITask> {
	constructor() {
		super('tasks', tasksSch, {
			enableCallMethodObserver: true,
			enableSubscribeObserver: true
		});
	}

	findByStatus(status: 'open' | 'completed', limit: number): ITask[] {
		return this.getCollectionInstance()
			.find({ status }, { sort: { updatedAt: -1 }, limit })
			.fetch();
	}

	isOwnerOrAdmin(task: ITask): boolean {
		try {
			const userId = Meteor.userId();
			if (!userId) return false;

			const isOwner = task.createdBy === userId;
			const userProfile = getUser();
			const roles: string[] = (userProfile as any)?.roles ?? [];
			const isAdmin = roles.includes(EnumUserRoles.ADMINISTRADOR);

			return isAdmin || isOwner;
		} catch (e) {
			return false;
		}
	}
}

export const tasksApi = new TasksApi();
