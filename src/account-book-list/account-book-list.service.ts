import { Injectable } from '@nestjs/common';
import { CreateAccountBookListDto } from './dto/create-account-book-list.dto';
import { AccountBookListEntity } from './entity/AccountBookList.entity';
import { getRepository, Repository, getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { verify } from 'jsonwebtoken';
import { AccountBookListBaseDto } from './dto/account-book-list.dto';
import { UpdateAccountBookDto } from './dto/update-account-book.dto';
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
        "accountBook.bookDate between DATE_FORMAT(:searchStartDate,'%Y-%m-%d') and DATE_FORMAT(:searchEndDate,'%Y-%m-%d')",
        { searchStartDate, searchEndDate },
      )
      .orderBy('bookDate', 'DESC')
      .orderBy('seq', 'ASC')
      .getMany();
  }
  async getAccountBookListByCalendar(
    userSeq: number,
    searchStartDate: string,
    searchEndDate: string,
  ): Promise<AccountBookListBaseDto[]> {
    const Result = getConnection()
      .createQueryBuilder()
      .select([
        'SUM(res.amount) as amount',
        'res.inOutType as `inOut`',
        'res.bookDate as bookDate',
      ])
      .from((subQuery) => {
        return subQuery
          .select([
            "DATE_FORMAT(accountBook.bookDate,'%Y.%m.%d') as bookDate",
            'accountBook.inOut as inOutType',
            'accountBook.amount as amount',
          ])
          .from(AccountBookListEntity, 'accountBook')
          .where('accountBook.userSeq=:userSeq', { userSeq })
          .andWhere(
            "accountBook.bookDate between DATE_FORMAT(:searchStartDate,'%Y-%m-%d') and DATE_FORMAT(:searchEndDate,'%Y-%m-%d')",
            { searchStartDate, searchEndDate },
          );
      }, 'res')
      .groupBy('res.bookDate,res.inOutType')
      .orderBy('res.bookDate', 'DESC')
      .getRawMany();
    return Result;
  }
  async getAccountBook(seq: number): Promise<AccountBookListBaseDto> {
    return await getRepository(AccountBookListEntity)
      .createQueryBuilder('accountBook')
      .select([
        'accountBook.seq',
        'accountBook.userSeq',
        'accountBook.inOut',
        'accountBook.bookDate',
        'accountBook.bookTitle',
        'accountBook.amount',
        'accountBook.inPurpose',
        'accountBook.outGoingPurpose',
      ])
      .where('accountBook.seq=:seq', { seq })
      .getOne();
  }
  async updateAccountBook(
    updateAccountBookDto: UpdateAccountBookDto,
  ): Promise<object> {
    const {
      seq,
      token,
      inOut,
      bookDate,
      bookTitle,
      amount,
      inPurpose,
      outGoingPurpose,
    } = updateAccountBookDto;
    const decoded = await verify(token, process.env.SECRET_KEY);

    return this.accountBookListEntity.update(seq, {
      userSeq: decoded.userSeq,
      inOut,
      bookDate,
      bookTitle,
      amount,
      inPurpose,
      outGoingPurpose,
      updateDate: () => 'NOW(3)',
    });
  }
  async createAccountBook(
    createAccountBookListDto: CreateAccountBookListDto,
  ): Promise<object> {
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
      userSeq: decoded.userSeq,
      inOut,
      bookDate,
      bookTitle,
      amount,
      inPurpose,
      outGoingPurpose,
    });
  }
  async deleteAccountBook(seq: number): Promise<object> {
    return this.accountBookListEntity.delete(seq);
  }
}
