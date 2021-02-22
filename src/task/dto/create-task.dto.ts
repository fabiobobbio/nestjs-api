import { IsDate, IsNotEmpty, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty({
    message: 'Informe um nome para tarefa.',
  })
  @MinLength(5, {
    message: 'O nome da tarefa deve ter ao menos de 5 caracteres',
  })
  nome: string;

  @IsNotEmpty({
    message: 'Informe a data da tarefa',
  })
  @IsDate({
    message: 'Informe uma data válida',
  })
  data: Date;

  @IsNotEmpty({
    message: 'Informe a hora da tarefa.',
  })
  hora: Date;
}
