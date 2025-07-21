import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';

@Resolver(() => Task)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @Mutation(() => Task, { description: 'Создаёт новую задачу и возвращает её' })
  createTask(
    @Args('data', { type: () => CreateTaskInput }) data: CreateTaskInput,
  ) {
    return this.tasksService.create(data);
  }

  @Mutation(() => Task, { description: 'Обновляет задачу по её ID' })
  updateTask(
    @Args('data', { type: () => UpdateTaskInput }) data: UpdateTaskInput,
  ) {
    return this.tasksService.update(data.id, data);
  }

  @Mutation(() => Task, { description: 'Удаляет задачу и отдаёт её данные' })
  removeTask(@Args('id', { type: () => Int }) id: number) {
    return this.tasksService.remove(id);
  }

  @Query(() => [Task], { name: 'tasks', description: 'Список всех задач' })
  findAll() {
    return this.tasksService.findAll();
  }

  @Query(() => Task, { name: 'task', description: 'Задача по её ID' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.tasksService.findOne(id);
  }
}
