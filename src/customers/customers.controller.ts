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

@Controller('customers')
export class CustomersController {
  @Get()
  findAll(@Res() response: Response) {
    return response
      .status(HttpStatus.OK)
      .send('this action returns all customers');
  }

  @Post()
  create(
    @Body() createCustomerDto: CreateCustomerDto,
    @Res() response: Response,
  ) {
    return response
      .status(HttpStatus.CREATED)
      .send('this action create a customer');
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Res() response: Response,
  ) {
    return response
      .status(HttpStatus.OK)
      .send('this action should update customer');
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Res() response: Response) {
    return response
      .status(HttpStatus.OK)
      .send('this action should delete a customer');
  }
}
