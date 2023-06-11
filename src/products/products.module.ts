import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductImage } from './entities';
import { AuthModule } from '../auth/auth.module';
import { StoresModule } from 'src/stores/stores.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage]),
    AuthModule,
    StoresModule,
  ],
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
