import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { StoresController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/auth/entities/user.entity';

@Module({
  controllers: [StoresController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
