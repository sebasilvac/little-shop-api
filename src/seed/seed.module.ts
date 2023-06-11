import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from '../products/products.module';
import { AuthModule } from 'src/auth/auth.module';
import { StoresModule } from 'src/stores/stores.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ProductsModule, AuthModule, StoresModule],
})
export class SeedModule {}
