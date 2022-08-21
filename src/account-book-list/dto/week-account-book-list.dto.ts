import { AccountBookListBaseDto } from './account-book-list.dto';
export class WeekAccountBookListDto extends AccountBookListBaseDto {
  readonly bookDateRange: string;
  readonly inComeAmount: number;
  readonly outGoingAmount: number;
}
