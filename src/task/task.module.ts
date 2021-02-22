import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from 'src/task/task.controller';
import { TaskRepository } from './task.repository';
import { TasksService } from './task.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskRepository])],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TaskModule {}
