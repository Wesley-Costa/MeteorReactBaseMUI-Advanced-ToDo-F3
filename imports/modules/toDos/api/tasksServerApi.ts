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
					authorName: 1,
					assignedTo: 1,
					status: 1,
					personal: 1
				}
			};
			const refinedOptions = { ...defaultOptions, ...options };
			return self.defaultListCollectionPublication(visibilityFilter, refinedOptions);
		});

		this.addPublication('list', function (this: any, search = '', filter = {}, options = {}) {
			const userId = this.userId;

			const searchTerm = typeof search === 'string' ? search.trim() : '';

			const visibilityFilter = {
				$or: [{ personal: { $ne: true } }, { createdBy: userId || null }]
			};

			const searchFilter =
				searchTerm.length > 0
					? {
							$or: [
								{ title: { $regex: searchTerm, $options: 'i' } },
								{ description: { $regex: searchTerm, $options: 'i' } }
							]
						}
					: null;

			const andConditions: object[] = [filter, visibilityFilter];
			if (searchFilter) {
				andConditions.push(searchFilter);
			}

			const treatedFilter = { $and: andConditions };

			const defaultOptions = {
				sort: { updatedAt: -1 },
				limit: 4,
				projection: {
					title: 1,
					description: 1,
					createdAt: 1,
					updatedAt: 1,
					createdBy: 1,
					authorName: 1,
					assignedTo: 1,
					status: 1,
					personal: 1
				}
			};
			const refinedOptions = { ...defaultOptions, ...options };
			return self.defaultListCollectionPublication(treatedFilter, refinedOptions);
		});

		this.addPublication('edit', (filter = {}) => {
			return self.defaultDetailCollectionPublication(filter, {
				projection: {
					title: 1,
					description: 1,
					createdAt: 1,
					updatedAt: 1,
					createdBy: 1,
					authorName: 1,
					assignedTo: 1,
					status: 1,
					personal: 1
				}
			});
		});
	}
}

export const tasksServerApi = new TasksServerApi();
