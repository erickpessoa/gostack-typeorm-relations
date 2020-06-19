import { inject, injectable } from 'tsyringe';

// import AppError from '@shared/errors/AppError';

import IProductsRepository from '../repositories/IProductsRepository';
import Product from '../infra/typeorm/entities/Product';

interface IRequest {
  id: string;
  quantity: number;
}

@injectable()
class UpdateProductsQuantityService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute(productsUpdate: IRequest[]): Promise<Product[]> {
    const products = await this.productsRepository.updateQuantity(
      productsUpdate,
    );

    return products;
  }
}

export default UpdateProductsQuantityService;
