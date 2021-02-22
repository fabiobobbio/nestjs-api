import { BaseQueryParametersDto } from '../../users/dto/base-query-parameters.dto';

export class FindTasksQueryDto extends BaseQueryParametersDto {
  nome: string;
  data: Date;
  hora: Date;
}
