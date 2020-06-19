// import { getRepository, Repository, In } from 'typeorm';
import { getRepository, Repository } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({ name, price, quantity });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({ where: { name } });

    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const listProducts = await this.ormRepository.findByIds(products);

    return listProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const productsIds = products.map(item => item.id);

    const listProducts = await this.ormRepository.findByIds(productsIds);

    const productsUpdate = listProducts.map(({ id, quantity, ...rest }) => {
      const newQuantity = products.find(item => item.id === id);

      if (!newQuantity) {
        return {
          id,
          quantity,
          ...rest,
        };
      }

      return {
        id,
        quantity: quantity - newQuantity.quantity,
        ...rest,
      };
    });

    await this.ormRepository.save(productsUpdate);

    return productsUpdate;
  }
}

export default ProductsRepository;
