import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnalyzeService } from './analyze.service';
import { AnalyzeUrlDto } from './dto/analyze-url.dto';

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
  async analyze(@Body() analyzeUrlDto: AnalyzeUrlDto): Promise<string[]> {
    return this.analyzeService.analyze(analyzeUrlDto.url);
  }
}
