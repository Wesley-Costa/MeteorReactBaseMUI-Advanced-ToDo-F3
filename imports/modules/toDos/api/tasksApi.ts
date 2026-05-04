import { ProductBase } from '../../../api/productBase';
import { tasksSch, ITask } from './tasksSch';

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
}

export const tasksApi = new TasksApi();