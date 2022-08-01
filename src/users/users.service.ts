import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UserInfo } from './UserInfo';
import * as uuid from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jsonwebtoken from 'jsonwebtoken';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
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
    let token = null;
    const user = await this.usersRepository.findOne({
      userId,
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      // 2. JWT를 발급
      token = await jsonwebtoken.sign(
        {
          userId,
          userName: user.userName,
          signVerifyToken: user.signVerifyToken,
        },
        process.env.SECRET_KEY,
        { expiresIn: '7d' },
      );
    } else {
      throw new UnprocessableEntityException(
        '해당 이메일은 계정은 없는계정입니다. 회원가입후 시도해주세요',
      );
    }
    return { isSuccess: true, token };
  }

  async getUserInfo(userId: string): Promise<UserInfo> {
    // 1. userId를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
    // 2. 조회된 데이터를 UserInfo 타입으로 응답
    return await this.usersRepository.findOne(userId);
    throw new Error('Method not implemented.');
  }
}
