import { Body, Post, Controller, Param, Get, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserInfo } from './UserInfo';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UsersService } from './users.service';
import { UserEntity } from './entity/users.entity';
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

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<object> {
    const { userId, password } = dto;
    const jwtResult = await this.usersService.login(userId, password);
    return jwtResult;
  }

  @Get('/:id')
  async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
    return this.usersService.getUserInfo(userId);
  }
}
