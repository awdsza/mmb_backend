export class AccountBookListBaseDto {
  readonly inOutType: string;
  readonly bookDate: object;
  readonly bookTitle: string;
  readonly amount: number;
  readonly inComePurpose: string;
  readonly outGoingPurpose: string;
  userSeq: number;
}
