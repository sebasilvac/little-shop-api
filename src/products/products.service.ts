import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';

import { Product, ProductImage } from './entities';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { User } from '../auth/entities/user.entity';
import { Store } from 'src/stores/entities/store.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>, // private readonly categoriesRepository: CategoriesRepository,

    @InjectRepository(ProductImage)
    private readonly productImagesRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto, store: Store) {
    try {
      const { images = [], ...productDetails } = createProductDto;

      const product = this.productsRepository.create({
        ...productDetails,
        price: Number(productDetails.price),
        store,
        images: images.map((image) =>
          this.productImagesRepository.create({ url: image }),
        ),
      });

      await this.productsRepository.save(product);
      return { ...product, images };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(paginationDto: PaginationDto, store: Store) {
    const { limit, offset } = paginationDto;
    const products = await this.productsRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      },
      where: {
        store: { id: store.id },
      },
    });

    return products.map(({ images, ...rest }) => ({
      ...rest,
      images: images.map((image) => image.url),
    }));
  }

  async findOne(find: string) {
    let product: Product;

    if (isUUID(find)) {
      product = await this.productsRepository.findOneBy({ id: find });
    } else {
      const queryBuilder = this.productsRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('LOWER(title) = :term OR slug = :term', {
          term: find.toLocaleLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'proImages')
        .getOne();
    }

    if (!product) {
      throw new NotFoundException(`Product with term ${find} not found`);
    }

    return product;
  }

  async findOnePlain(find: string) {
    const { images = [], ...rest } = await this.findOne(find);
    return { ...rest, images: images.map((image) => image.url) };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const { images, ...toUpdate } = updateProductDto;

    // preload busca por el id, y setea los valores que se le pasan en updateProductDto
    const product = await this.productsRepository.preload({
      id,
      ...toUpdate,
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    // query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, {
          product: { id },
        });

        product.images = images.map((image) =>
          this.productImagesRepository.create({ url: image }),
        );
      }

      await queryRunner.manager.save<Product>(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain(id);
    } catch (error) {
      console.log('error', error);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBException(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }

  private handleDBException(error: any) {
    this.logger.error(error);

    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    throw new InternalServerErrorException(
      'Unextepted error, check server logs',
    );
  }

  async deleteAll() {
    try {
      const products = await this.productsRepository.find();
      await this.productsRepository.remove(products);

      return { deleted: products.length };
    } catch (error) {
      console.log('error', error);
      this.handleDBException(error);
    }
  }
}
