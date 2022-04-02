import { IsUrl } from 'class-validator';

export class URLDto {
  @IsUrl()
  public url: string;
}
