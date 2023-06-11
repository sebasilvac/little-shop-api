import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [StoresController],
  providers: [StoresService],
  imports: [TypeOrmModule.forFeature([Store]), AuthModule],
  exports: [StoresService, TypeOrmModule],
})
export class StoresModule {}
