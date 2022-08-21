import { Injectable } from '@nestjs/common';
import { CreateAccountBookListDto } from './dto/create-account-book-list.dto';
import { AccountBookListEntity } from './entity/AccountBookList.entity';
import { getRepository, Repository, getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { verify } from 'jsonwebtoken';
import { AccountBookListBaseDto } from './dto/account-book-list.dto';
import { UpdateAccountBookDto } from './dto/update-account-book.dto';
import { WeekAccountBookListDto } from './dto/week-account-book-list.dto';
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
        'res.inOutType as inOutType',
        'res.bookDate as bookDate',
      ])
      .from((subQuery) => {
        return subQuery
          .select([
            "DATE_FORMAT(accountBook.bookDate,'%Y.%m.%d') as bookDate",
            'accountBook.inOutType as inOutType',
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
  async getAccountBookWeekList(
    userSeq: number,
    searchStartDate: string,
    searchEndDate: string,
  ): Promise<WeekAccountBookListDto[]> {
    const Result = getConnection()
      .createQueryBuilder()
      .select(['amount', 'inOutType', 'bookDateRange'])
      .from((subQuery) => {
        return subQuery
          .select([
            'sum(amount) as amount',
            'inOutType',
            `CONCAT(DATE_FORMAT(DATE_ADD(bookDate,
              INTERVAL(1-DAYOFWEEK(bookDate)) DAY),"%Y.%m.%d")," - ",DATE_FORMAT(DATE_ADD(bookDate,
              INTERVAL(7-DAYOFWEEK(bookDate)) DAY),"%Y.%m.%d")) AS bookDateRange`,
          ])
          .from(AccountBookListEntity, 'accountBook')
          .where('accountBook.userSeq=:userSeq', { userSeq })
          .andWhere(
            "accountBook.bookDate between DATE_FORMAT(:searchStartDate,'%Y-%m-%d') and DATE_FORMAT(:searchEndDate,'%Y-%m-%d')",
            { searchStartDate, searchEndDate },
          ).groupBy(`CONCAT(DATE_FORMAT(DATE_ADD(bookDate,
            INTERVAL(1-DAYOFWEEK(bookDate)) DAY),"%Y.%m.%d")," - ",DATE_FORMAT(DATE_ADD(bookDate,
            INTERVAL(7-DAYOFWEEK(bookDate)) DAY),"%Y.%m.%d")),inOutType`);
      }, 'res')
      .orderBy('res.bookDateRange', 'DESC')
      .getRawMany();

    return Result;
  }
  async getAccountBookDetailByCalendar(
    userSeq: number,
    bookDate: string,
  ): Promise<AccountBookListBaseDto[]> {
    return await getRepository(AccountBookListEntity)
      .createQueryBuilder('accountBook')
      .select([
        'seq',
        'userSeq',
        'inOutType',
        'bookTitle',
        'amount',
        'inPurpose',
        'outGoingPurpose',
      ])
      .where('accountBook.userSeq=:userSeq', { userSeq })
      .andWhere("accountBook.bookDate=DATE_FORMAT(:bookDate,'%Y-%m-%d')", {
        bookDate,
      })
      .getRawMany();
  }

  async getAccountBook(seq: number): Promise<AccountBookListBaseDto> {
    return await getRepository(AccountBookListEntity)
      .createQueryBuilder('accountBook')
      .select([
        'accountBook.seq',
        'accountBook.userSeq',
        'accountBook.inOutType',
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
      inOutType,
      bookDate,
      bookTitle,
      amount,
      inPurpose,
      outGoingPurpose,
    } = updateAccountBookDto;
    const decoded = await verify(token, process.env.SECRET_KEY);

    return this.accountBookListEntity.update(seq, {
      userSeq: decoded.userSeq,
      inOutType,
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
      inOutType,
      bookDate,
      bookTitle,
      amount,
      inPurpose,
      outGoingPurpose,
    } = createAccountBookListDto;

    const decoded = await verify(token, process.env.SECRET_KEY);

    return this.accountBookListEntity.save({
      userSeq: decoded.userSeq,
      inOutType,
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
