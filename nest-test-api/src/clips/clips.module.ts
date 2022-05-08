import { Module } from '@nestjs/common';
import { ClipsService } from './clips.service';
import { ClipsController } from './clips.controller';

@Module({
  controllers: [ClipsController],
  providers: [ClipsService]
})
export class ClipsModule {}
