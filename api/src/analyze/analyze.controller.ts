import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AnalyzeService } from './analyze.service';
import { AnalyzeUrlDto } from './dto/analyze-url.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('analyze')
@Controller('analyze')
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}

  @Post()
  @ApiOperation({ summary: 'Parse video URL with youtube-dl' })
  @ApiBody({ type: AnalyzeUrlDto })
  @ApiResponse({
    status: 200,
    description: `Returns an array of URLs, which may correspond to multiple audio/video
    tracks for the same video. Often there is only a single URL result at index 0.`,
    type: String,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description:
      'The requested URL was not found. If you entered the URL manually please check your spelling and try again.',
  })
  async analyze(@Body() analyzeUrlDto: AnalyzeUrlDto): Promise<string[]> {
    return this.analyzeService.analyze(analyzeUrlDto.url);
  }
}
