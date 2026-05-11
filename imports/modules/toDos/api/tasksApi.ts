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

	async canActOnTask(taskId: string): Promise<boolean> {
		try {
			return await this.callMethodWithPromise('canActOnTask', { taskId });
		} catch (error) {
			console.error('Erro ao verificar permissão:', error);
			return false;
		}
	}
}

export const tasksApi = new TasksApi();