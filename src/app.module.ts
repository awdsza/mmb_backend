import { Module } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { UserEntity } from './users/entity/users.entity';
import { AccountBookListEntity } from './account-book-list/entity/AccountBookList.entity';
import { AccountBookListController } from './account-book-list/account-book-list.controller';
import { AccountBookListService } from './account-book-list/account-book-list.service';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { CategoryEntity } from './category/entity/category.entity';
dotenv.config({
  path: path.resolve(
    process.env.NODE_ENV === 'production'
      ? '.production.env'
      : process.env.NODE_ENV === 'stage'
      ? '.stage.env'
      : '.development.env',
  ),
});
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: 'mms',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE),
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      AccountBookListEntity,
      CategoryEntity,
    ]),
  ],
  controllers: [UsersController, AccountBookListController, CategoryController],
  providers: [UsersService, AccountBookListService, CategoryService],
})
export class AppModule {}
