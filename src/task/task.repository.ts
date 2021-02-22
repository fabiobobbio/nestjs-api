import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { FindTasksQueryDto } from './dto/find-taskss-query.dto';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { nome, data, hora } = createTaskDto;

    const task = this.create();
    task.nome = nome;
    task.data = data;
    task.hora = hora;

    try {
      await task.save();
      delete task.nome;
      delete task.data;
      delete task.hora;
      return task;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao salvar o usuário no banco de dados',
      );
    }
  }

  async findTasks(
    queryDto: FindTasksQueryDto,
  ): Promise<{ tasks: Task[]; total: number }> {
    queryDto.page = queryDto.page < 1 ? 1 : queryDto.page;
    queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit;

    const { nome, data, hora } = queryDto;
    const query = this.createQueryBuilder('task');

    if (nome) {
      query.where('task.nome ILIKE :nome', { nome: `%${nome}%` });
    }

    if (data) {
      query.andWhere('task.data ILIKE :data', { data });
    }

    if (hora) {
      query.andWhere('task.hora = :role', { hora });
    }
    query.skip((queryDto.page - 1) * queryDto.limit);
    query.take(+queryDto.limit);
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.select(['task.nome', 'task.data', 'task.hora']);
    const [tasks, total] = await query.getManyAndCount();

    return { tasks, total };
  }
}
