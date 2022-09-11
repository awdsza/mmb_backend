import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from 'src/users/entity/users.entity';
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
@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity) private userEntity: Repository<UserEntity>,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //토큰을 headerdml bearer Toekn타입에서 가져옴
    });
  }
  async validate(payload) {
    const { userSeq } = payload;
    const user = await this.userEntity.findOne({ userSeq });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
