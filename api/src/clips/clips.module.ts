import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ClipsService } from './clips.service';
import { ClipsController } from './clips.controller';
import { ClipSchema } from './schema/clip.schema';
import ClipCreatedListener from './listeners/clip-created.listener';

@Module({
  controllers: [ClipsController],
  imports: [MongooseModule.forFeature([{ name: 'Clip', schema: ClipSchema }])],
  providers: [ClipsService, ClipCreatedListener],
})
export class ClipsModule {}
