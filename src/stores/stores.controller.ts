import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { ValidRoles } from '../auth/interfaces';

@Controller('stores')
@Auth()
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createStoreDto: CreateStoreDto, @GetUser() user: User) {
    return this.storesService.create(createStoreDto, user);
  }

  @Get()
  @Auth(ValidRoles.admin)
  findAll(@Query() paginationDto: PaginationDto, @GetUser() user: User) {
    return this.storesService.findAll(paginationDto, user);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.storesService.findOne(id, user);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
    @GetUser() user: User,
  ) {
    return this.storesService.update(id, updateStoreDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.superUser)
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.storesService.remove(id, user);
  }
}
