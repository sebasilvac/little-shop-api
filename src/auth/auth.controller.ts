import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateUserDto, LoginUserDto } from './dto';
import { Auth, GetUser } from './decorators';
import { User } from './entities/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('signin')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get()
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth(@Req() req) {
    return;
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    if (!req.user) throw new UnauthorizedException('Invalid credentials');
    const { token, email } = await this.authService.googleLogin(req);
    res.redirect(
      `${process.env.REDIRECT_URL}/auth/callback?token=${token}&email=${email}`,
    );
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }
}
