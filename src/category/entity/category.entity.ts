import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
@Entity('mms_user_category')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  @PrimaryColumn()
  seq: number;

  @Column()
  userSeq: number;

  @Column({ length: 20 })
  inOutType: string;

  @Column({ length: 30 })
  category: string;

  @Column({ length: 50 })
  categoryName: string;

  @Column()
  sortKey: number;

  @Column({ type: 'datetime', default: () => 'NOW()', nullable: true })
  createDate: Date;

  @Column({ type: 'datetime', nullable: true })
  updateDate: Date;
}
