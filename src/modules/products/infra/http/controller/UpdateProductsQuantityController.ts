import { Request, Response } from 'express';

import { container } from 'tsyringe';
import UpdateProductsQuantityService from '@modules/products/services/UpdateProductsQuantityService';

export default class ProductsController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { products } = request.body;

    const updateProductsQuantity = container.resolve(
      UpdateProductsQuantityService,
    );

    const product = await updateProductsQuantity.execute(products);

    return response.json(product);
  }
}
