import { ProductBase } from '../../../api/productBase';
import { tasksSch, ITask } from './tasksSch';

class TasksApi extends ProductBase<ITask> {
  constructor() {
    super('tasks', tasksSch, {
      enableCallMethodObserver: true,
      enableSubscribeObserver: true,
    });
  }
}

export const tasksApi = new TasksApi();