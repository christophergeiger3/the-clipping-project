import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClipsModule } from './clips/clips.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AnalyzeController } from './analyze/analyze.controller';
import { AnalyzeService } from './analyze/analyze.service';
import { AnalyzeModule } from './analyze/analyze.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(), // for .env files
    ClipsModule,
    EventEmitterModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    AnalyzeModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'videos'),
    }),
  ],
  controllers: [AppController, AnalyzeController],
  providers: [AppService, AnalyzeService],
})
export class AppModule {}
