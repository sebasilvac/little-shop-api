import { BadRequestException, Injectable, Logger } from '@nestjs/common';
//import { parse } from 'path';

import { parse } from 'papaparse';
import { ProductsService } from 'src/products/products.service';
import { User } from '../auth/entities/user.entity';
import { Store } from 'src/stores/entities/store.entity';

@Injectable()
export class FilesService {
  private logger = new Logger('DatabaseMiddleware');
  constructor(private readonly productsService: ProductsService) {}

  async loadProductFile(file: string, user: User) {
    const parsedCsv = await parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        const texto = header
          .toLowerCase()
          .trim()
          .normalize('NFD')
          .replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, '$1$2')
          .normalize();

        return texto;
      },
    });

    if (parsedCsv.errors.length > 0) {
      throw new BadRequestException(parsedCsv.errors[0].message);
    }

    this.logger.error(parsedCsv.data);

    this.insertProducts(parsedCsv.data, user.store);
  }

  insertProducts(products: any, store: Store) {
    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(
        this.productsService.create(
          {
            code: product.codigo,
            title: product.descripcion,
            price: product.precio,
            tags: product.categoria.split(','),
          },
          store,
        ),
      );
    });

    return Promise.all(insertPromises);
  }
}
