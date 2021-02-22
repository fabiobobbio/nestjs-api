import { ValidationPipe } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Patch } from '@nestjs/common';
import { Delete } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { FindTasksQueryDto } from './dto/find-taskss-query.dto';
import { ReturnTaskDto } from './dto/return-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Query } from '@nestjs/common';
import { TasksService } from './task.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  async createTask(
    @Body(ValidationPipe) createTaskDto: CreateTaskDto,
  ): Promise<ReturnTaskDto> {
    const task = await this.tasksService.createTask(createTaskDto);
    return {
      task,
      message: 'Tarefa cadastrada com sucesso!',
    };
  }

  @Get(':id')
  async findTaskById(@Param('id') id): Promise<ReturnTaskDto> {
    const task = await this.tasksService.findTaskById(id);
    return {
      task,
      message: 'Tarefa encontrada',
    };
  }

  @Patch(':id')
  async updateTask(
    @Body(ValidationPipe) updateTaskDto: UpdateTaskDto,
    @Param('id') id: string,
  ) {
    return this.tasksService.updateTask(updateTaskDto, id);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    await this.tasksService.deleteTask(id);
    return {
      message: 'Usuário removido com sucesso',
    };
  }

  @Get()
  async findTasks(@Query() query: FindTasksQueryDto) {
    const found = await this.tasksService.findTasks(query);
    return {
      found,
      message: 'Tarefas encontrados',
    };
  }
}
