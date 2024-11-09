import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'The customer name',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    description: 'The customer salary',
    example: 'R$ 1000',
  })
  @IsString()
  @IsNotEmpty()
  readonly salary: string;

  @ApiProperty({
    description: 'The customer company',
    example: 'Teddy',
  })
  @IsString()
  @IsNotEmpty()
  readonly company: string;
}
