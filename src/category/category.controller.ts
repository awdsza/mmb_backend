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
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryBaseDto } from './dto/category-base.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @Get('/:userSeq/:inOutType')
  async getCategories(
    @Param('inOutType') inOutType: string,
    @Param('userSeq') userSeq: number,
  ): Promise<CategoryBaseDto[]> {
    try {
      return await this.categoryService.getCategories(inOutType, userSeq);
    } catch (e) {}
  }

  @Post()
  async saveCategory(
    @Body() categoryParamDto: CategoryBaseDto,
  ): Promise<object> {
    const { inOutType, userSeq, categoryName } = categoryParamDto;
    try {
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
  @Get('/:seq')
  async getCategory(@Param('seq') seq: number): Promise<CategoryBaseDto> {
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
