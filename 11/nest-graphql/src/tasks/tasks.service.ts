import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskInput: CreateTaskInput) {
    const task = this.tasksRepository.create(createTaskInput);
    return this.tasksRepository.save(task);
  }

  findAll() {
    return this.tasksRepository.find();
  }

  async findOne(id: number) {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException(`Task #${id} not found`);
    return task;
  }

  async update(id: number, updateTaskInput: UpdateTaskInput) {
    const task = await this.tasksRepository.preload(updateTaskInput);
    if (!task) throw new NotFoundException(`Task #${id} not found`);
    return this.tasksRepository.save(task);
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    await this.tasksRepository.remove({ ...task });
    return task;
  }
}
