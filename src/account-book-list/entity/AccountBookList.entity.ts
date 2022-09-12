import { CategoryEntity } from 'src/category/entity/category.entity';
import {
  Column,
  Entity,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('mms_account_book_list')
export class AccountBookListEntity {
  @PrimaryGeneratedColumn()
  @PrimaryColumn()
  seq: number;

  @Column()
  userSeq: number;

  @Column({ length: 50, nullable: true })
  inOutType: string;

  @Column({ type: 'date', nullable: true })
  bookDate: Date;

  @Column({ length: 100, nullable: true })
  bookTitle: string;

  @Column({ nullable: true })
  amount: number;

  @Column({ length: 100, nullable: true })
  inComePurpose: string;

  @Column({ length: 10, nullable: true })
  outGoingPurpose: string;

  @Column({ type: 'datetime', default: () => 'NOW()', nullable: true })
  createDate: Date;

  @Column({ type: 'datetime', nullable: true })
  updateDate: Date;
}
