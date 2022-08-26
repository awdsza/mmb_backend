import { Controller, Get, Param, Post, Query, Body } from '@nestjs/common';
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
    return await this.categoryService.saveCategory(
      inOutType,
      userSeq,
      categoryName,
    );
  }
  @Get('/:seq')
  async getCategory(@Param('seq') seq: number): Promise<CategoryBaseDto> {
    try {
      return await this.categoryService.getCategory(seq);
    } catch (e) {}
  }
}
