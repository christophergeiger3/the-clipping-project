import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreateClipDto {
  @ApiProperty({
    description: 'URL passed to youtube-dl --get-video',
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
    description: 'Output file name',
    example: 'output.mp4',
  })
  readonly output: string;

  // @ApiProperty({
  //   description: 'Custom FFMPEG command',
  //   example: '-c:v libx264 -c:a aac',
  // })
  // @IsOptional()
  // @IsString()
  // readonly customFFMPEGCommand?: string;
}
