import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { User } from '../entities/user.entity';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user as User;

  if (!user) throw new InternalServerErrorException('User not found');

  // data is string
  if (data && typeof data === 'string') return user[data];

  // data is array
  if (data && Array.isArray(data)) {
    const result = {};

    data.forEach((key) => {
      result[key] = user[key];
    });

    return result;
  }

  return user;
});
