import { AccountBookListBaseDto } from './account-book-list.dto';
export class UpdateAccountBookDto extends AccountBookListBaseDto {
  private _seq: number;
  readonly token: string;
  set seq(value: number) {
    this._seq = value;
  }
}
