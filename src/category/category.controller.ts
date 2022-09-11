import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Body,
  Put,
  UnauthorizedException,
  InternalServerErrorException,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryBaseDto } from './dto/category-base.dto';
import { GetUser } from 'src/auth/user-decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/users/entity/users.entity';
@Controller('category')
@UseGuards(AuthGuard('jwt'))
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @Get('/:inOutType')
  async getCategories(
    @GetUser() user: UserEntity,
    @Param('inOutType') inOutType: string,
  ): Promise<CategoryBaseDto[]> {
    try {
      const { userSeq } = user;
      return await this.categoryService.getCategories(inOutType, userSeq);
    } catch (e) {}
  }

  @Post()
  async saveCategory(
    @GetUser() user: UserEntity,
    @Body() categoryParamDto: CategoryBaseDto,
  ): Promise<object> {
    const { inOutType, categoryName } = categoryParamDto;
    try {
      const { userSeq } = user;
      const result = await this.categoryService.saveCategory(
        inOutType,
        userSeq,
        categoryName,
      );
      if (result) {
        return { ...result, isSuccess: true };
      } else {
        throw new InternalServerErrorException();
      }
    } catch (e) {
      return { ...e, isSuccess: false };
    }
  }
  @Get('/:inOutType/:seq')
  async getCategory(
    @Param('inOutType') inOutType: string,
    @Param('seq') seq: number,
  ): Promise<CategoryBaseDto> {
    try {
      return await this.categoryService.getCategory(seq);
    } catch (e) {}
  }

  @Put('/:seq')
  async updateCategory(
    @Param('seq') seq: number,
    @Body() categoryParamDto: CategoryBaseDto,
  ): Promise<object> {
    try {
      const result = await this.categoryService.updateCategory({
        ...categoryParamDto,
        seq,
      });
      if (result) {
        return { ...result, isSuccess: true };
      } else {
        throw new InternalServerErrorException();
      }
    } catch (e) {
      return { ...e, isSuccess: false };
    }
  }
  @Put('/sort/:inouttype')
  async updateCategoriesSort(
    @GetUser() user: UserEntity,
    @Param('inouttpye') inOutType: string,
    @Body() categoryParamDto: CategoryBaseDto[],
  ): Promise<object> {
    try {
      const { userSeq } = user;
      const result = await this.categoryService.updateCategoriesSort(
        userSeq,
        inOutType,
        categoryParamDto,
      );
      if (result) {
        return { ...result, isSuccess: true };
      } else {
        throw new InternalServerErrorException();
      }
    } catch (e) {
      return { ...e, isSuccess: false };
    }
  }
  @Delete('/:seq')
  async deleteCategory(@Param('seq') seq: number): Promise<object> {
    try {
      const result = await this.categoryService.deleteCategory(seq);
      if (result) {
        return { ...result, isSuccess: true };
      } else {
        throw new InternalServerErrorException();
      }
    } catch (e) {
      return { ...e, isSuccess: false };
    }
  }
}
