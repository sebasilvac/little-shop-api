import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './entities/store.entity';

import { User } from '../../auth/entities/user.entity';
import { PaginationDto } from '../../common/dtos/pagination.dto';

@Injectable()
export class StoresService {
  private readonly logger = new Logger(StoresService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Store)
    private readonly storesRepository: Repository<Store>,
  ) {}

  async create(createStoreDto: CreateStoreDto, userConnected: User) {
    try {
      const user = await this.userRepository.findOneBy({
        id: createStoreDto.userId,
      });

      if (!user) {
        throw new BadRequestException(
          `User with id ${createStoreDto.userId} not found`,
        );
      }

      const store = this.storesRepository.create({
        ...createStoreDto,
        user,
        createdBy: userConnected,
      });

      await this.storesRepository.save(store);
      return store;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;
    const stores = await this.storesRepository.find({
      take: limit,
      skip: offset,
      relations: {
        user: true,
      },
    });

    return stores;
  }

  async findOne(find: string) {
    let store: Store;

    if (isUUID(find)) {
      store = await this.storesRepository.findOneBy({ id: find });
    } else {
      const queryBuilder = this.storesRepository.createQueryBuilder('prod');
      store = await queryBuilder
        .where('LOWER(name) = :term OR slug = :term', {
          term: find.toLocaleLowerCase(),
        })
        .getOne();
    }

    if (!store) {
      throw new NotFoundException(`Product with term ${find} not found`);
    }

    return store;
  }

  async update(id: string, updateStoreDto: UpdateStoreDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId, ...rest } = updateStoreDto;

    const store = await this.storesRepository.preload({
      id,
      ...rest,
    });

    if (!store) {
      throw new NotFoundException(`Store with id ${id} not found`);
    }

    try {
      await this.storesRepository.save(store);
      return store;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: string) {
    const store = await this.findOne(id);
    await this.storesRepository.remove(store);
  }

  async deleteAll() {
    try {
      const stores = await this.storesRepository.find();
      await this.storesRepository.remove(stores);
    } catch (error) {
      console.log(error);
      this.handleDBException(error);
    }
  }

  private handleDBException(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unextepted error, check server logs',
    );
  }
}
