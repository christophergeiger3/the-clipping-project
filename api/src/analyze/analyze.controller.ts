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
    description: 'The records have been successfully returned',
    type: String,
    isArray: true,
  })
  async analyze(@Body() analyzeUrlDto: AnalyzeUrlDto): Promise<string[]> {
    return this.analyzeService.analyze(analyzeUrlDto.url);
  }
}
