import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { CreateAccountBookListDto } from './dto/create-account-book-list.dto';
import { AccountBookListService } from './account-book-list.service';
import { AccountBookListBaseDto } from './dto/account-book-list.dto';
import { ParamAccountBookListDto } from './dto/param-account-book-list.dto';
@Controller('accountbook')
export class AccountBookListController {
  constructor(private accountBookListService: AccountBookListService) {}

  @Get('/:userSeq/bookDate/:searchStartDate/:searchEndDate')
  async getAccountBookList(
    @Param('userSeq') userSeq: number,
    @Param('searchStartDate') searchStartDate: string,
    @Param('searchEndDate') searchEndDate: string,
  ): Promise<AccountBookListBaseDto[]> {
    return await this.accountBookListService.getAccountBookList(
      userSeq,
      searchStartDate,
      searchEndDate,
    );
  }
  @Post()
  async createAccountBook(
    @Body() accountBookListdto: CreateAccountBookListDto,
  ): Promise<object> {
    const result = await this.accountBookListService.createAccountBook(
      accountBookListdto,
    );
    if (result) {
      return { ...result, isSuccess: true };
    } else {
      return { ...result, isSuccess: false };
    }
  }
}