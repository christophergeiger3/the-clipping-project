import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClipsModule } from './clips/clips.module';

@Module({
  imports: [ClipsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
