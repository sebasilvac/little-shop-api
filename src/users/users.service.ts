import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(user: User) {
    const userDb: User = await this.userRepository.findOneBy({
      id: user.id,
    });

    if (!userDb) {
      throw new NotFoundException(`User not found`);
    }

    return userDb;
  }
}
