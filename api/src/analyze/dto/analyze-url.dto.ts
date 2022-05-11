import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class AnalyzeUrlDto {
  @ApiProperty({
    description: 'URL passed to youtube-dl --get-video',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  })
  @IsUrl()
  readonly url: string;
}
