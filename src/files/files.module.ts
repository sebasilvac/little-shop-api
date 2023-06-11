import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [ProductsModule, AuthModule],
})
export class FilesModule {}
