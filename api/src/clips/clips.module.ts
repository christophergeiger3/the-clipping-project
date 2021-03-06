import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ClipsService } from './clips.service';
import { ClipsController } from './clips.controller';
import { ClipSchema } from './schema/clip.schema';
import ClipCreatedListener from './listeners/clip-created.listener';
import { AnalyzeModule } from '../analyze/analyze.module';

@Module({
  controllers: [ClipsController],
  imports: [
    MongooseModule.forFeature([{ name: 'Clip', schema: ClipSchema }]),
    AnalyzeModule,
  ],
  providers: [ClipsService, ClipCreatedListener],
})
export class ClipsModule {}
