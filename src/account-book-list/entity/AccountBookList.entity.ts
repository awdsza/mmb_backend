import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mms_account_book_list')
export class AccountBookListEntity {
  @PrimaryGeneratedColumn()
  @PrimaryColumn()
  seq: number;

  @Column({ length: 50 })
  userId: string;

  @Column({ length: 50 })
  inOut: string;

  @Column()
  bookDate: Date;

  @Column({ length: 100 })
  bookTitle: string;

  @Column()
  amount: number;

  @Column({ length: 100, nullable: true })
  inPurpose: string;

  @Column({ length: 10, nullable: true })
  outGoingPurpose: string;

  @Column({ type: 'datetime', default: () => 'NOW()', nullable: true })
  createDate: Date;

  @Column({ type: 'datetime', nullable: true })
  updateDate: Date;
}
