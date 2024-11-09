import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The customers data was sent successfully',
    type: Customer,
    isArray: true,
  })
  async findAll(@Res() response: Response): Promise<Response<Customer[]>> {
    const customers = await this.customersService.getAllCustomers();

    return response.status(HttpStatus.OK).send(customers);
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The customer was created successfully',
    type: Customer,
  })
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
    @Res() response: Response,
  ): Promise<Response<Customer>> {
    const customer =
      await this.customersService.createCustomer(createCustomerDto);
    return response.status(HttpStatus.CREATED).send(customer);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'The customer was updated successfully',
    type: Customer,
  })
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Res() response: Response,
  ): Promise<Response<Customer>> {
    const updatedCustomer = await this.customersService.updateCustomer(
      id,
      updateCustomerDto,
    );
    return response.status(HttpStatus.OK).send(updatedCustomer);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The customer was removed successfully',
    type: Customer,
  })
  async remove(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<Response<Customer>> {
    const removedCustomer = await this.customersService.removeCustomer(id);
    return response.status(HttpStatus.OK).send(removedCustomer);
  }
}
