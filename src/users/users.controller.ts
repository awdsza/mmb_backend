import { Body, Post, Controller, Param, Get, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserInfo } from './UserInfo';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UsersService } from './users.service';
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { userId, userName, password } = dto;
    await this.usersService.createUser(userId, userName, password);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    console.log(dto);
    return;
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<UserInfo> {
    const { userId, password } = dto;

    return await this.usersService.login(userId, password);
  }

  @Get('/:id')
  async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
    return this.usersService.getUserInfo(userId);
  }
}
