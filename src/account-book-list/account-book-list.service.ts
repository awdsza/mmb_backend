import { Injectable } from '@nestjs/common';
import { CreateAccountBookListDto } from './dto/create-account-book-list.dto';
import { AccountBookListEntity } from './entity/AccountBookList.entity';
import { getRepository, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Between } from 'typeorm';
import { verify } from 'jsonwebtoken';
import { AccountBookListBaseDto } from './dto/account-book-list.dto';
@Injectable()
export class AccountBookListService {
  constructor(
    @InjectRepository(AccountBookListEntity)
    private accountBookListEntity: Repository<AccountBookListEntity>,
  ) {}

  async getAccountBookList(
    userSeq: number,
    searchStartDate: string,
    searchEndDate: string,
  ): Promise<AccountBookListBaseDto[]> {
    return await getRepository(AccountBookListEntity)
      .createQueryBuilder('accountBook')
      .where('userSeq=:userSeq', { userSeq })
      .andWhere(
        "accountBook.bookDate between DATE_FORMAT(CONCAT(:searchStartDate,' 00:00:00'),'%Y-%m-%d %H:%i:%s') and DATE_FORMAT(CONCAT(:searchEndDate,' 23:59:59'),'%Y-%m-%d %H:%i:%s')",
        { searchStartDate, searchEndDate },
      )
      .getMany();
  }
  async createAccountBook(
    createAccountBookListDto: CreateAccountBookListDto,
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
    } = createAccountBookListDto;

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
