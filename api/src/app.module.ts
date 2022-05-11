import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClipsModule } from './clips/clips.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AnalyzeController } from './analyze/analyze.controller';
import { AnalyzeService } from './analyze/analyze.service';

@Module({
  imports: [
    ClipsModule,
    EventEmitterModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost/the-clipping-project'),
  ],
  controllers: [AppController, AnalyzeController],
  providers: [AppService, AnalyzeService],
})
export class AppModule {}
