import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed';
import { User } from '../auth/entities/user.entity';
import { StoresService } from '../stores/stores.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly storeService: StoresService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async deleteAll() {
    await this.productsService.deleteAll();
    await this.storeService.deleteAll();
    await this.userRepository.createQueryBuilder().delete().execute();
    return 'All products deleted';
  }

  async deleteAllProducts() {
    await this.productsService.deleteAll();
    return 'All products deleted';
  }

  async populateDB() {
    await this.deleteAll();

    const user = await this.insertUsers();
    await this.insertStores(user);
    //await this.insertProducts(user);
    return 'Seed Executed';
  }

  private async insertUsers(): Promise<any> {
    const seedUsers = initialData.users;
    const users: User[] = [];

    seedUsers.forEach((user) => {
      user.password = bcrypt.hashSync(user.password, 10);
      users.push(this.userRepository.create(user));
    });

    const dbUsers = await this.userRepository.save(users);
    return dbUsers[0];
  }

  private async insertStores(user: User): Promise<any> {
    const stores = initialData.stores;
    const insertPromises = [];

    stores.forEach((store) => {
      insertPromises.push(
        this.storeService.create(
          {
            userId: user.id,
            ...store,
          },
          user,
        ),
      );
    });

    return Promise.all(insertPromises);
  }

  // private async insertProducts(user: User): Promise<any> {
  //   const products = initialData.products;
  //   const insertPromises = [];

  //   products.forEach((product) => {
  //     insertPromises.push(this.productsService.create(product, user.store));
  //   });

  //   return Promise.all(insertPromises);
  // }
}
