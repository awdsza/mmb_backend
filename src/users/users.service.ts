import {
  Injectable,
  UnprocessableEntityException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as uuid from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/users.entity';
import { getRepository, Repository } from 'typeorm';
import { BaseUsersDto } from './dto/base-users.dto';
import * as bcrypt from 'bcryptjs';
import * as jsonwebtoken from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}
  async createUser(
    userId: string,
    userName: string,
    password: string,
  ): Promise<UserEntity> {
    const userExist = await this.checkUserExists(userId);
    if (userExist) {
      throw new UnprocessableEntityException(
        '해당 이메일은 이미 가입되어있습니다.',
      );
    }
    const signupVerifyToken = uuid.v1();

    return await this.saveUser(userId, userName, password, signupVerifyToken);
    //await this.sendMemberJoinEmail(email, signupVerifyToken);
  }
  private async checkUserExists(userId: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ userId });
    return user !== undefined;
  }

  private async saveUser(
    userId: string,
    userName: string,
    password: string,
    signVerifyToken: string,
  ): Promise<UserEntity> {
    const salt = await bcrypt.genSalt();

    const encryptedPassowrd = await bcrypt.hash(password, salt); // sync

    const user = new UserEntity();
    user.userId = userId;
    user.userName = userName;
    user.password = encryptedPassowrd;
    user.signVerifyToken = signVerifyToken;
    return await this.usersRepository.save(user);
  }

  async login(userId: string, password: string): Promise<object> {
    // TODO
    // 1. email, password를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
    const user = await this.getUserInfo(userId);
    if (!user) {
      throw new UnprocessableEntityException(
        '해당 이메일은 계정은 없는계정입니다. 회원가입후 시도해주세요',
      );
    }
    if (await this.verifyPassword(password, user.password)) {
      throw new UnprocessableEntityException('비밀번호가 틀렸습니다.');
    }
    // 2. JWT를 발급
    const access_token = this.jwtService.sign(
      {
        isSuccess: true,
        userId,
        userSeq: user.userSeq,
        userName: user.userName,
        signVerifyToken: user.signVerifyToken,
      },
      // {secret?: string | Buffer;
      // privateKey?: string | Buffer
      // }
      { secret: process.env.SECRET_KEY },
    );

    return {
      isSuccess: true,
      access_token,
      userName: user.userName,
      syncDateTime: new Date().getTime(),
    };
  }
  async verifyPassword(
    plainPassword: string,
    hasedPassword: string,
  ): Promise<object> {
    return await bcrypt.compare(plainPassword, hasedPassword);
  }
  async getUserInfo(userId: string): Promise<BaseUsersDto> {
    try {
      return await getRepository(UserEntity)
        .createQueryBuilder()
        .select([
          'userSeq',
          'userId',
          'userName',
          'password',
          'signVerifyToken',
        ])
        .where('userId=:userId', { userId })
        .getRawOne();
    } catch (e) {
      throw new Error('Method not implemented.');
    }
  }
  public async getAuthenticatedUser(
    email: string,
    plainPassword: string,
  ): Promise<object> {
    try {
      const user = await this.getUserInfo(email);
      const isVerifyPassword = this.verifyPassword(
        plainPassword,
        user.password,
      );
      if (!isVerifyPassword) {
        throw new HttpException('Wrong credentials', HttpStatus.BAD_REQUEST);
      }
      return { ...user, password: null };
    } catch (error) {
      return error;
    }
  }
}
