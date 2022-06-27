import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUrl, Min } from 'class-validator';

export class CreateClipDto {
  @ApiProperty({
    description: 'URL passed to yt-dlp --get-video',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  })
  @IsUrl()
  readonly url: string;

  @ApiProperty({
    description: 'Start time in milliseconds',
    example: 0,
  })
  @Min(0)
  @IsInt()
  readonly start: number;

  @ApiProperty({
    description: 'End time in milliseconds',
    example: 1000,
  })
  @Min(1)
  @IsInt()
  readonly end: number;

  @ApiProperty({
    description: 'Clip name, without extension',
    example: 'big-buck-bunny',
  })
  readonly name: string;
}
