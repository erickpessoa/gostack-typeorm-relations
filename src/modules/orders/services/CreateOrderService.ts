import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer not found.');
    }

    const productsId = products.map(item => {
      return { id: item.id };
    });

    const selectedProducts = await this.productsRepository.findAllById(
      productsId,
    );

    if (selectedProducts.length !== productsId.length) {
      throw new AppError('Some product(s) not found.');
    }

    await this.productsRepository.updateQuantity(products);

    const itens = selectedProducts.map(product => {
      const selectedQuantity = products.find(item => item.id === product.id);

      if (!selectedQuantity) {
        throw new AppError('Quantity off product not found');
      }

      if (product.quantity < selectedQuantity.quantity) {
        throw new AppError('Insufficient stock');
      }

      return {
        product_id: product.id,
        quantity: selectedQuantity.quantity,
        price: product.price,
      };
    });

    const newOrder = await this.ordersRepository.create({
      customer,
      products: itens,
    });

    return newOrder;
  }
}

export default CreateOrderService;
