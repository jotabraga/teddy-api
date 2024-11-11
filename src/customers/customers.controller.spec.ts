import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { Response } from 'express';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerDto } from './dto/customer.dto';

describe('CustomersController', () => {
  let controller: CustomersController;
  let customersService: CustomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: {
            getCustomers: jest.fn(),
            createCustomer: jest.fn(),
            updateCustomer: jest.fn(),
            removeCustomer: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    customersService = module.get<CustomersService>(CustomersService);
  });

  describe('findAll', () => {
    it('should return all customers', async () => {
      const mockCustomers: CustomerDto[] = [
        { id: 1, name: 'John', salary: '5000', company: 'teddy' },
        { id: 2, name: 'Jane', salary: '6000', company: 'teddy' },
      ];

      (customersService.getCustomers as jest.Mock).mockResolvedValue([
        mockCustomers,
        2,
      ]);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      const queryParams = {};

      await controller.findCustomers(queryParams, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith([mockCustomers, 2]);
    });
  });

  describe('create', () => {
    it('should create a customer and return it', async () => {
      const createCustomerDto: CreateCustomerDto = {
        name: 'Alice',
        salary: '8000',
        company: 'Tech Corp',
      };
      const mockCustomer: CustomerDto = {
        id: 1,
        ...createCustomerDto,
      };

      (customersService.createCustomer as jest.Mock).mockResolvedValue(
        mockCustomer,
      );

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      await controller.create(createCustomerDto, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.send).toHaveBeenCalledWith(mockCustomer);
    });
  });

  describe('update', () => {
    it('should update a customer and return it', async () => {
      const updateCustomerDto: UpdateCustomerDto = {
        name: 'Alice Updated',
        salary: '8500',
        company: 'Tech Corp',
      };
      const customerId = '1';
      const updatedCustomer: CustomerDto = {
        id: 1,
        name: 'Alice Updated',
        salary: '8500',
        company: 'Tech Corp',
      };

      (customersService.updateCustomer as jest.Mock).mockResolvedValue(
        updatedCustomer,
      );

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      await controller.update(customerId, updateCustomerDto, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(updatedCustomer);
    });
  });

  describe('remove', () => {
    it('should remove a customer and return it', async () => {
      const customerId = '1';
      const removedCustomer: CustomerDto = {
        id: 1,
        name: 'Alice',
        salary: '8000',
        company: 'Tech Corp',
      };

      (customersService.removeCustomer as jest.Mock).mockResolvedValue(
        removedCustomer,
      );

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      await controller.remove(customerId, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(removedCustomer);
    });
  });
});
