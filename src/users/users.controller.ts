import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { ValidRoles } from '../auth/interfaces';

@Controller('users')
@Auth()
export class StoresController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @Auth(ValidRoles.admin)
  async findAll(@GetUser() user: User) {
    const userDb: User = await this.usersService.findOne(user);

    return {
      email: userDb.email,
      fullName: userDb.fullName,
      roles: userDb.roles,
      store: {
        id: userDb.store.id,
        name: userDb.store.name,
      },
      isActive: userDb.isActive,
    };
  }
}
