import { ApiProperty } from '@nestjs/swagger';

export class CustomerDto {
  @ApiProperty({ example: 1, description: 'Unique identifier of the customer' })
  id: number;

  @ApiProperty({ example: 'John', description: 'Name of the customer' })
  name: string;

  @ApiProperty({
    example: 'Teddy',
    description: 'Company name of the customer',
  })
  company: string;

  @ApiProperty({ example: 'R$ 5000', description: 'Salary of the customer' })
  salary: string;
}
