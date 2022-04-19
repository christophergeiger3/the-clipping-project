import { IsInt, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreateClipDto {
  @IsUrl()
  public url: string;

  @Min(0)
  @IsInt()
  public start: number;

  @Min(1)
  @IsInt()
  public end: number;

  @IsString()
  public output: string;

  @IsOptional()
  @IsString()
  public customFFMPEGCommand?: string;
}
