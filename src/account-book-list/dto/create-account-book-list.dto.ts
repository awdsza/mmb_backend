export class AccountBookListDto {
  readonly token: string;
  readonly inOut: string;
  readonly bookDate: object;
  readonly bookTitle: string;
  readonly amount: number;
  readonly inPurpose: string;
  readonly outGoingPurpose: string;
}
