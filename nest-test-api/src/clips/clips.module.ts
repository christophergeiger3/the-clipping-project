import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ClipsService } from './clips.service';
import { ClipsController } from './clips.controller';
import { ClipSchema } from './schema/clip.schema';

@Module({
  controllers: [ClipsController],
  imports: [MongooseModule.forFeature([{ name: 'Clip', schema: ClipSchema }])],
  providers: [ClipsService],
})
export class ClipsModule {}
