import { ProductServerBase } from '../../../api/productServerBase';
import { tasksSch, ITask } from './tasksSch';
import { Recurso } from '../config/recursos';

class TasksServerApi extends ProductServerBase<ITask> {
	constructor() {
		super('tasks', tasksSch, {
			resources: Recurso
		});

		const self = this;

		this.addPublication('recent', function (this: any, options = {}) {
			const userId = this.userId;
			const visibilityFilter = {
				$or: [{ personal: { $ne: true } }, { createdBy: userId || null }]
			};
			const defaultOptions = {
				sort: { updatedAt: -1 },
				limit: 5,
				projection: {
					title: 1,
					description: 1,
					createdAt: 1,
					updatedAt: 1,
					createdBy: 1,
					authorName:1,
					status: 1,
					personal: 1
				}
			};

			const refinedOptions = { ...defaultOptions, ...options };

			return self.defaultListCollectionPublication(visibilityFilter, refinedOptions);
		});

		this.addPublication('list', function (this: any, filter = {}, options = {}) {
			const userId = this.userId;
			const visibilityFilter = {
				$or: [{ personal: { $ne: true } }, { createdBy: userId || null }]
			};
			const treatedFilter = { $and: [filter, visibilityFilter] };
			const defaultOptions = {
				sort: { updatedAt: -1 },
				limit: 6,
				projection: {
					title: 1,
					description: 1,
					createdAt: 1,
					updatedAt: 1,
					createdBy: 1,
					authorName:1,
					status: 1,
					personal: 1
				}
			};

			const refinedOptions = { ...defaultOptions, ...options };

			return self.defaultListCollectionPublication(treatedFilter, refinedOptions);
		});

		this.addPublication('detail', (filter = {}) => {
			return self.defaultDetailCollectionPublication(filter, {
				projection: {
					title: 1,
					description: 1,
					createdAt: 1,
					updatedAt: 1,
					createdBy: 1,
					authorName:1,
					status: 1,
					personal: 1
				}
			});
		});
	}
}

export const tasksServerApi = new TasksServerApi();
