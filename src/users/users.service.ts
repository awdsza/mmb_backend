import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UserInfo } from './UserInfo';
import * as uuid from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}
  async createUser(userId: string, userName: string, password: string) {
    const userExist = await this.checkUserExists(userId);
    if (userExist) {
      throw new UnprocessableEntityException(
        '해당 이메일은 이미 가입되어있습니다.',
      );
    }
    const signupVerifyToken = uuid.v1();

    await this.saveUser(userId, userName, password, signupVerifyToken);
    //await this.sendMemberJoinEmail(email, signupVerifyToken);
  }
  private async checkUserExists(userId: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ USER_ID: userId });
    return user !== undefined;
  }

  private async saveUser(
    userId: string,
    userName: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const salt = await bcrypt.genSalt();

    const encryptedPassowrd = await bcrypt.hash(password, salt); // sync

    const user = new UserEntity();
    user.USER_ID = userId;
    user.USER_NAME = userName;
    user.PASSWORD = encryptedPassowrd;
    user.SIGN_VERIFY_TOKEN = signupVerifyToken;
    await this.usersRepository.save(user);
  }

  async login(userId: string, password: string): Promise<UserInfo> {
    // TODO
    // 1. email, password를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
    const user = await this.usersRepository.findOne({
      USER_ID: userId,
    });
    const comparePassword = await bcrypt.compare(password, user.PASSWORD);
    if (user && comparePassword) {
      // 2. JWT를 발급
    } else {
      throw new UnprocessableEntityException(
        '해당 이메일은 계정은 없는계정입니다. 회원가입후 시도해주세요',
      );
    }
    return user;
  }
  async getUserInfo(userId: string): Promise<UserInfo> {
    // 1. userId를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
    // 2. 조회된 데이터를 UserInfo 타입으로 응답
    return await this.usersRepository.findOne(userId);
    throw new Error('Method not implemented.');
  }
}
