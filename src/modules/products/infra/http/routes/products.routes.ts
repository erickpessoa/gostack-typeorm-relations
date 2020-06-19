import { Router } from 'express';

import ProductsController from '../controller/ProductsController';
import UpdateProductsQuantityController from '../controller/UpdateProductsQuantityController';

const productsRouter = Router();
const productsController = new ProductsController();
const updateProductsQuantityControlller = new UpdateProductsQuantityController();

productsRouter.post('/', productsController.create);
productsRouter.patch(
  '/update-quantity',
  updateProductsQuantityControlller.update,
);

export default productsRouter;
