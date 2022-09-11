import { Req, Body, Post, Controller, Query, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UsersService } from './users.service';
import { LocalAuthenticationGuard } from 'src/auth/authentication.guard';
import RequestWithUser from '../auth/requestWithUser.interface';
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<object> {
    const { userId, userName, password } = dto;
    const { signVerifyToken } = await this.usersService.createUser(
      userId,
      userName,
      password,
    );
    return { userId, userName, signVerifyToken };
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    console.log(dto);
    return;
  }

  @UseGuards(LocalAuthenticationGuard)
  @Post('/login')
  async login(@Req() request: RequestWithUser): Promise<object> {
    // const { userId, password } = dto;
    // const jwtResult = await this.usersService.login(userId, password);
    // return jwtResult;
    const user = request.user;
    user.password = undefined;
    return user;
  }
}
