import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mms_user_info')
export class UserEntity {
  @PrimaryGeneratedColumn()
  @PrimaryColumn()
  userSeq: number;

  @Column({ length: 50 })
  userId: string;

  @Column({ length: 50 })
  userName: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 100 })
  signVerifyToken: string;
}
