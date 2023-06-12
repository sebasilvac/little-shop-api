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
import { Auth, GetUser } from '../../auth/decorators';
import { User } from '../../auth/entities/user.entity';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { ValidRoles } from '../../auth/interfaces';

@Controller('admin/stores')
@Auth(ValidRoles.superUser)
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  createByAdmin(
    @Body() createStoreDto: CreateStoreDto,
    @GetUser() userConnected: User,
  ) {
    return this.storesService.create(createStoreDto, userConnected);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.storesService.findAll(paginationDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storesService.update(id, updateStoreDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storesService.remove(id);
  }
}
