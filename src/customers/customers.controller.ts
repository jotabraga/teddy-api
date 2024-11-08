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

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  async findAll(@Res() response: Response): Promise<Response<Customer[]>> {
    const customers = await this.customersService.getAllCustomers();

    return response.status(HttpStatus.OK).send(customers);
  }

  @Post()
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
    @Res() response: Response,
  ): Promise<Response<Customer>> {
    const customer =
      await this.customersService.createCustomer(createCustomerDto);
    return response.status(HttpStatus.CREATED).send(customer);
  }

  @Put(':id')
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
  async remove(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<Response<Customer>> {
    const removedCustomer = await this.customersService.removeCustomer(id);
    return response.status(HttpStatus.OK).send(removedCustomer);
  }
}
