import { Module } from '@nestjs/common';
import { AccountBookListService } from './account-book-list.service';
import { AccountBookListController } from './account-book-list.controller';
import { AccountBookListEntity } from './entity/AccountBookList.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from 'src/auth/authentication.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([AccountBookListEntity]),
    AuthenticationModule,
  ],
  providers: [AccountBookListService],
  controllers: [AccountBookListController],
})
export class AccountBookModule {}
