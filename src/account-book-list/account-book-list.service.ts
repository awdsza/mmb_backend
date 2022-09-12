import { Injectable } from '@nestjs/common';
import { CreateAccountBookListDto } from './dto/create-account-book-list.dto';
import { AccountBookListEntity } from './entity/AccountBookList.entity';
import { getRepository, Repository, getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
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
    const result = await getConnection()
      .createQueryBuilder()
      .select([
        'res.*',
        '(select categoryName from mms_user_category sub where sub.userSeq = res.userSeq and sub.inOutType = res.inOutType and sub.category = res.category) AS categoryName',
      ])
      .from((subQuery) => {
        return subQuery
          .select([
            'seq',
            'userSeq',
            'bookTitle',
            'amount',
            'inOutType',
            `IFNULL((CASE WHEN inOutType = 'outGoing' THEN outGoingPurpose ELSE inComePurpose end ),999) AS category`,
            `DATE_FORMAT(bookDate,'%Y-%m-%d') as bookDate`,
          ])
          .from(AccountBookListEntity, 'acc')
          .where('userSeq=:userSeq', { userSeq })
          .andWhere(
            "acc.bookDate between DATE_FORMAT(:searchStartDate,'%Y-%m-%d') and DATE_FORMAT(:searchEndDate,'%Y-%m-%d')",
            { searchStartDate, searchEndDate },
          );
      }, 'res')
      .orderBy('res.bookDate', 'DESC');
    return result.getRawMany();
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
      .select(['inComeAmount', 'outGoingAmount', 'bookDateRange'])
      .from((subQuery) => {
        return subQuery
          .select([
            `SUM((CASE WHEN inOutType='inCome' THEN amount ELSE 0 END)) as inComeAmount`,
            `SUM((CASE WHEN inOutType='outGoing' THEN amount ELSE 0 END)) as outGoingAmount`,
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
            INTERVAL(7-DAYOFWEEK(bookDate)) DAY),"%Y.%m.%d"))`);
      }, 'res')
      .orderBy('res.bookDateRange', 'DESC')
      .getRawMany();

    return Result;
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
        'accountBook.inComePurpose',
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
      inOutType,
      bookDate,
      bookTitle,
      amount,
      inComePurpose,
      outGoingPurpose,
    } = updateAccountBookDto;

    return this.accountBookListEntity.update(seq, {
      //userSeq: decoded.userSeq,
      inOutType,
      bookDate,
      bookTitle,
      amount,
      inComePurpose,
      outGoingPurpose,
      updateDate: () => 'NOW(3)',
    });
  }
  async createAccountBook(
    createAccountBookListDto: CreateAccountBookListDto,
  ): Promise<object> {
    const {
      inOutType,
      bookDate,
      bookTitle,
      amount,
      inComePurpose,
      outGoingPurpose,
      userSeq,
    } = createAccountBookListDto;

    return this.accountBookListEntity.save({
      userSeq,
      inOutType,
      bookDate,
      bookTitle,
      amount,
      inComePurpose,
      outGoingPurpose,
    });
  }
  async deleteAccountBook(seq: number): Promise<object> {
    return this.accountBookListEntity.delete(seq);
  }
}
