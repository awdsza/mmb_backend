import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { CreateAccountBookListDto } from './dto/create-account-book-list.dto';
import { AccountBookListService } from './account-book-list.service';
import { AccountBookListBaseDto } from './dto/account-book-list.dto';
import { UpdateAccountBookDto } from './dto/update-account-book.dto';

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
  @Get('/:seq')
  async getAccountBook(
    @Param('seq') seq: number,
  ): Promise<AccountBookListBaseDto> {
    return await this.accountBookListService.getAccountBook(seq);
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
  @Put('/:seq')
  async updateAccountBook(
    @Body() updateAccountBookDto: UpdateAccountBookDto,
    @Param('seq') seq: number,
  ): Promise<object> {
    updateAccountBookDto.seq = seq;
    const result = await this.accountBookListService.updateAccountBook(
      updateAccountBookDto,
    );
    if (result) {
      return { ...result, isSuccess: true };
    } else {
      return { ...result, isSuccess: false };
    }
  }
}
