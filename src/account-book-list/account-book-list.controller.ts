import { Controller, Get, Post, Put, Body } from '@nestjs/common';
import { AccountBookListDto } from './dto/create-account-book-list.dto';
import { AccountBookListService } from './account-book-list.service';
@Controller('accountbook')
export class AccountBookListController {
  constructor(private accountBookListService: AccountBookListService) {}

  @Get('/:userSeq')
  async getAccountBookList(): Promise<object> {
    return Object.create({});
  }
  @Post()
  async createAccountBook(
    @Body() accountBookListdto: AccountBookListDto,
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
