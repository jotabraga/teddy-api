import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn(),
});

describe('CustomersService', () => {
  let service: CustomersService;
  let repository: MockRepository<Customer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    repository = module.get<MockRepository<Customer>>(
      getRepositoryToken(Customer),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllCustomers', () => {
    it('should return all customers', async () => {
      const mockedCustomers = [
        {
          id: 1,
          name: 'John',
          salary: '5000',
          company: 'teddy',
        },
        {
          id: 2,
          name: 'Peter',
          salary: '6000',
          company: 'teddy',
        },
        {
          id: 3,
          name: 'Maria',
          salary: '7000',
          company: 'teddy',
        },
      ];
      repository.find.mockResolvedValue(mockedCustomers);
      const result = await service.getAllCustomers();
      expect(result).toEqual(mockedCustomers);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array if there is not any customer', async () => {
      const mockedNoCustomersData: any[] = [];
      repository.find.mockResolvedValue(mockedNoCustomersData);
      const result = await service.getAllCustomers();
      expect(result).toEqual(mockedNoCustomersData);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findCustomerById', () => {
    it('should return the customers if ID exists', async () => {
      const customerId = '1';
      const mockedCustomer = {
        id: 1,
        name: 'John',
        salary: '5000',
        company: 'teddy',
      };
      repository.findOne.mockReturnValue(mockedCustomer);
      const result = await service.findCustomerById(customerId);
      expect(result).toEqual(mockedCustomer);
      expect(repository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw the NotFoundException if ID do not exist', async () => {
      const customerId = '1';
      repository.findOne.mockReturnValue(undefined);

      try {
        await service.findCustomerById(customerId);
        expect(false).toBeTruthy(); // it should never hit this line
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual(`Customer #1 not found`);
      }
    });
  });

  describe('createCustomer', () => {
    it('should create and return the new customer', async () => {
      const createCustomerDto: CreateCustomerDto = {
        name: 'Alice',
        salary: '8000',
        company: 'Teddy Co',
      };
      const savedCustomer = { id: 1, ...createCustomerDto };

      repository.create.mockReturnValue(savedCustomer);
      repository.save.mockResolvedValue(savedCustomer);

      const result = await service.createCustomer(createCustomerDto);
      expect(result).toEqual(savedCustomer);
      expect(repository.create).toHaveBeenCalledWith(createCustomerDto);
      expect(repository.save).toHaveBeenCalledWith(savedCustomer);
    });
  });

  describe('updateCustomer', () => {
    it('should update and return the customer if found', async () => {
      const updateCustomerDto: UpdateCustomerDto = {
        name: 'Alice Updated',
        salary: '8500',
        company: 'Teddy Corp',
      };
      const existingCustomer = {
        id: 1,
        name: 'Alice',
        salary: '8000',
        company: 'Teddy Corp',
      };
      const updatedCustomer = { ...existingCustomer, ...updateCustomerDto };

      repository.preload.mockResolvedValue(updatedCustomer);
      repository.save.mockResolvedValue(updatedCustomer);

      const result = await service.updateCustomer('1', updateCustomerDto);
      expect(result).toEqual(updatedCustomer);
      expect(repository.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateCustomerDto,
      });
      expect(repository.save).toHaveBeenCalledWith(updatedCustomer);
    });

    it('should throw NotFoundException if customer does not exist', async () => {
      const updateCustomerDto: UpdateCustomerDto = {
        name: 'Non-existent Customer',
        salary: '0',
        company: 'None',
      };

      repository.preload.mockResolvedValue(undefined);

      try {
        await service.updateCustomer('1', updateCustomerDto);
        expect(false).toBeTruthy(); // it should never hit this line
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('Customer #1 not found');
      }
    });
  });

  describe('removeCustomer', () => {
    it('should remove and return the customer if found', async () => {
      const customerToRemove = {
        id: 1,
        name: 'Alice',
        salary: '8000',
        company: 'Teddy Ltda',
      };

      repository.findOne.mockResolvedValue(customerToRemove);
      repository.remove.mockResolvedValue(customerToRemove);

      const result = await service.removeCustomer('1');
      expect(result).toEqual(customerToRemove);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.remove).toHaveBeenCalledWith(customerToRemove);
    });

    it('should throw NotFoundException if customer to remove does not exist', async () => {
      repository.findOne.mockResolvedValue(undefined);

      try {
        await service.removeCustomer('1');
        expect(false).toBeTruthy(); // it should never hit this line
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('Customer #1 not found');
      }
    });
  });
});
