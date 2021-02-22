import { IsString, IsDate } from 'class-validator';

export class UpdateTaskDto {
  @IsString({
    message: 'Informe um nome de tarefa válido',
  })
  nome: string;

  @IsDate({
    message: 'Informe uma data válida',
  })
  data: Date;

  @IsDate()
  hora: Date;
}
