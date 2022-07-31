import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('mms_user_info')
export class UserEntity {
  @Column({ length: 50 })
  @PrimaryColumn()
  userId: string;

  @Column({ length: 50 })
  userName: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 100 })
  signVerifyToken: string;
}
