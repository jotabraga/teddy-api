import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { QueryParamsDto } from './dto/query-params.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async getCustomers(
    queryParams: QueryParamsDto,
  ): Promise<[Customer[], number]> {
    const { limit = 10, offset = 1 } = queryParams;
    return this.customerRepository.findAndCount({
      skip: limit * (offset - 1),
      take: limit,
    });
  }

  async findCustomerById(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id: +id },
    });
    if (!customer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }
    return customer;
  }

  async createCustomer(
    createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    const customer = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(customer);
  }

  async updateCustomer(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.customerRepository.preload({
      id: +id,
      ...updateCustomerDto,
    });
    if (!customer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }

    return this.customerRepository.save(customer);
  }

  async removeCustomer(id: string): Promise<Customer> {
    const customer = await this.findCustomerById(id);
    return this.customerRepository.remove(customer);
  }
}
