import { Injectable } from '@nestjs/common';
import { AccountBookListDto } from './dto/create-account-book-list.dto';
import { AccountBookListEntity } from './entity/AccountBookList.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { verify } from 'jsonwebtoken';
@Injectable()
export class AccountBookListService {
  constructor(
    @InjectRepository(AccountBookListEntity)
    private accountBookListEntity: Repository<AccountBookListEntity>,
  ) {}

  async createAccountBook(
    accountBookListdto: AccountBookListDto,
  ): Promise<object> {
    const returnObject = Object.create({});
    const {
      token,
      inOut,
      bookDate,
      bookTitle,
      amount,
      inPurpose,
      outGoingPurpose,
    } = accountBookListdto;

    const decoded = await verify(token, process.env.SECRET_KEY);

    return this.accountBookListEntity.save({
      userId: decoded.userId,
      inOut,
      bookDate,
      bookTitle,
      amount,
      inPurpose,
      outGoingPurpose,
    });
  }
}
