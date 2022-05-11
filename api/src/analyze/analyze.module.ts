import { AnalyzeService } from './analyze.service';
import { Module } from '@nestjs/common';
import { AnalyzeController } from './analyze.controller';

@Module({
  controllers: [AnalyzeController],
  providers: [AnalyzeService],
  exports: [AnalyzeService],
})
export class AnalyzeModule {}
