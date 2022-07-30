import { Injectable } from '@nestjs/common';
import { UserInfo } from './UserInfo';
import * as uuid from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/users.entity';
import { Repository } from 'typeorm';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}
  async createUser(userId: string, userName: string, password: string) {
    await this.checkUserExists(userId);

    const signupVerifyToken = uuid.v1();

    await this.saveUser(userId, userName, password, signupVerifyToken);
    //await this.sendMemberJoinEmail(email, signupVerifyToken);
  }
  private checkUserExists(email: string) {
    return false; // TODO: DB 연동 후 구현
  }

  private async saveUser(
    userId: string,
    userName: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const user = new UserEntity();
    user.USER_ID = userId;
    user.USER_NAME = userName;
    user.PASSWORD = password;
    user.SIGN_VERIFY_TOKEN = signupVerifyToken;
    await this.usersRepository.save(user);
  }

  async login(email: string, password: string): Promise<string> {
    // TODO
    // 1. email, password를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
    // 2. JWT를 발급

    throw new Error('Method not implemented.');
  }
  async getUserInfo(userId: string): Promise<UserInfo> {
    // 1. userId를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
    // 2. 조회된 데이터를 UserInfo 타입으로 응답

    throw new Error('Method not implemented.');
  }
}
