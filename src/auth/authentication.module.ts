import { Module } from '@nestjs/common';
// import { UsersModule } from '../users/users.module';
import { UsersService } from 'src/users/users.service';
import { UsersController } from 'src/users/users.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(
    process.env.NODE_ENV === 'production'
      ? '.production.env'
      : process.env.NODE_ENV === 'stage'
      ? '.stage.env'
      : '.development.env',
  ),
});
@Module({
  imports: [PassportModule],
  providers: [UsersService, LocalStrategy],
  controllers: [UsersController],
})
export class AuthenticationModule {}
