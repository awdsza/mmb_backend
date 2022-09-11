import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { LocalStrategy } from '../auth/local.strategy';
@Module({
  providers: [UsersService, LocalStrategy],
  controllers: [UsersController],
  // exports: [UsersService],
})
export class UsersModule {}
