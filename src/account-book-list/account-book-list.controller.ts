import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { CreateAccountBookListDto } from './dto/create-account-book-list.dto';
import { AccountBookListService } from './account-book-list.service';
import { AccountBookListBaseDto } from './dto/account-book-list.dto';
import { UpdateAccountBookDto } from './dto/update-account-book.dto';

@Controller('accountbook')
export class AccountBookListController {
  constructor(private accountBookListService: AccountBookListService) {}

  @Get()
  async getAccountBookList(
    @Query('userSeq') userSeq: number,
    @Query('searchStartDate') searchStartDate: string,
    @Query('searchEndDate') searchEndDate: string,
  ): Promise<AccountBookListBaseDto[]> {
    return await this.accountBookListService.getAccountBookList(
      userSeq,
      searchStartDate,
      searchEndDate,
    );
  }
  @Get('/calendar')
  async getAccountBookListByCalendar(
    @Query('userSeq') userSeq: number,
    @Query('searchStartDate') searchStartDate: string,
    @Query('searchEndDate') searchEndDate: string,
  ): Promise<AccountBookListBaseDto[]> {
    return await this.accountBookListService.getAccountBookListByCalendar(
      userSeq,
      searchStartDate,
      searchEndDate,
    );
  }
  @Get('/calendar/detail')
  async getAccountBookDetailByCalendar(
    @Query('userSeq') userSeq: number,
    @Query('bookDate') bookDate: string,
  ): Promise<AccountBookListBaseDto[]> {
    return await this.accountBookListService.getAccountBookDetailByCalendar(
      userSeq,
      bookDate,
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
  @Delete('/:seq')
  async deleteAccountBook(@Param('seq') seq: number): Promise<object> {
    const result = await this.accountBookListService.deleteAccountBook(seq);
    if (result) {
      return { ...result, isSuccess: true };
    } else {
      return { ...result, isSuccess: false };
    }
  }
}
