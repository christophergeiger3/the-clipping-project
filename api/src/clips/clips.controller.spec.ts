import { AnalyzeModule } from '../analyze/analyze.module';
import { Test, TestingModule } from '@nestjs/testing';
import { ClipsController } from './clips.controller';
import { ClipsModule } from './clips.module';
import { ClipsService } from './clips.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';

describe('ClipsController', () => {
  let controller: ClipsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClipsModule,
        AnalyzeModule,
        EventEmitterModule.forRoot(),
        // TODO: avoid database connection during testing
        // TODO: fix improper teardown
        MongooseModule.forRoot(process.env.DATABASE_URL),
      ],
    }).compile();

    controller = module.get<ClipsController>(ClipsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
