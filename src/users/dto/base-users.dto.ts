export class BaseUsersDto {
  readonly userSeq: number;
  readonly userId: string;
  readonly userName: string;
  readonly password: string;
  readonly syncTime: string;
  readonly signVerifyToken: string;
}
