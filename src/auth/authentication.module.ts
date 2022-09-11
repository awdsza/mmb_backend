import { Module } from '@nestjs/common';

// import { UsersModule } from '../users/users.module';
import { UsersService } from 'src/users/users.service';
import { UsersController } from 'src/users/users.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entity/users.entity';
import { JWTStrategy } from './jwt.strategy';

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
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3600s' },
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [UsersService, LocalStrategy, JWTStrategy],
  controllers: [UsersController],
  exports: [JWTStrategy, PassportModule],
})
export class AuthenticationModule {}
