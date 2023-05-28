import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async deleteAll() {
    await this.productsService.deleteAllproducts();
    return 'All products deleted';
  }

  async populateDB() {
    this.productsService.deleteAllproducts();
    const products = initialData.products;
    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product));
    });

    await Promise.all(insertPromises);
    return 'Seed Executed';
  }
}
