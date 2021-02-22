import { NotFoundException } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateTaskDto } from 'src/task/dto/update-task.dto';
import { Task } from 'src/task/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { FindTasksQueryDto } from './dto/find-taskss-query.dto';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async createTask(createtaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createtaskDto);
  }

  async findTaskById(TaskId: string): Promise<Task> {
    const task = await this.taskRepository.findOne(TaskId, {
      select: ['nome', 'data', 'hora'],
    });

    if (!task) throw new NotFoundException('Tarefa não encontrada');

    return task;
  }

  async updateTask(updateTaskDto: UpdateTaskDto, id: string): Promise<Task> {
    const task = await this.findTaskById(id);
    const { nome, data, hora } = updateTaskDto;
    task.nome = nome ? nome : task.nome;
    task.data = data ? data : task.data;
    task.hora = hora ? hora : task.hora;
    try {
      await task.save();
      return task;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao salvar os dados no banco de dados',
      );
    }
  }

  async deleteTask(taskId: string) {
    const result = await this.taskRepository.delete({ id: taskId });
    if (result.affected === 0) {
      throw new NotFoundException(
        'Não foi encontrada uma tarefa com o ID informado',
      );
    }
  }

  async findTasks(
    queryDto: FindTasksQueryDto,
  ): Promise<{ tasks: Task[]; total: number }> {
    const tasks = await this.taskRepository.findTasks(queryDto);
    return tasks;
  }
}
