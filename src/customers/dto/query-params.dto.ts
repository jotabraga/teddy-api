import { IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryParamsDto {
  @ApiProperty({ example: 10, description: 'Per page param' })
  @IsOptional()
  @IsInt()
  limit?: number;

  @ApiProperty({ example: 1, description: 'Page param' })
  @IsOptional()
  @IsInt()
  offset?: number;
}
