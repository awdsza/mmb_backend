import { Injectable } from '@nestjs/common';
import { getRepository, Repository, getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entity/category.entity';
import { CategoryBaseDto } from './dto/category-base.dto';
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryEntity: Repository<CategoryEntity>,
  ) {}
  async getCategories(
    inOutType: string,
    userSeq: number,
  ): Promise<CategoryBaseDto[]> {
    return await getRepository(CategoryEntity)
      .createQueryBuilder()
      .select(['seq', 'inOutType', 'category', 'categoryName'])
      .where('userSeq=:userSeq', { userSeq })
      .andWhere('inOutType=:inOutType', { inOutType })
      .orderBy('seq')
      .orderBy('sortKey', 'DESC')
      .getRawMany();
  }

  async saveCategory(
    inOutType: string,
    userSeq: number,
    categoryName: string,
  ): Promise<object> {
    let recentData = await getRepository(CategoryEntity)
      .createQueryBuilder()
      .select([
        'MAX(IFNULL(category,0))+1 as category',
        'MAX(IFNULL(sortKey,0))+1 as sortKey',
      ])
      .where('userSeq=:userSeq', { userSeq })
      .andWhere('inOutType=:inOutType', { inOutType })
      .groupBy('userSeq,inOutType')
      .getRawOne();
    if (!recentData) {
      recentData = { ...recentData, category: 1, sortKey: 1 };
    }
    return await this.categoryEntity.save({
      inOutType,
      userSeq,
      category: recentData.category,
      categoryName,
      sortKey: recentData.sortKey,
    });
  }

  async getCategory(seq: number): Promise<CategoryBaseDto> {
    return await this.categoryEntity.findOne({ seq });
  }
}
