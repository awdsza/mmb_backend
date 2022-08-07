import { AccountBookListBaseDto } from './account-book-list.dto';
export class CreateAccountBookListDto extends AccountBookListBaseDto {
  readonly token: string;
}
