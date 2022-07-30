import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('mms_user_info')
export class UserEntity {
  @Column({ length: 50 })
  @PrimaryColumn()
  USER_ID: string;

  @Column({ length: 50 })
  USER_NAME: string;

  @Column({ length: 30 })
  PASSWORD: string;

  @Column({ length: 100 })
  SIGN_VERIFY_TOKEN: string;
}
