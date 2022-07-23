import { TEST_DATABASE_URL } from './../env.default';
import { Test, TestingModule } from '@nestjs/testing';
import { AnalyzeModule } from '../analyze/analyze.module';
import { ClipsService } from './clips.service';
import { ClipsModule } from './clips.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';

describe('ClipsService', () => {
  let service: ClipsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClipsModule,
        AnalyzeModule,
        EventEmitterModule.forRoot(),
        // TODO: avoid database connection during testing
        // TODO: fix improper teardown
        MongooseModule.forRoot(
          process.env.TEST_DATABASE_URL || TEST_DATABASE_URL,
        ),
      ],
    }).compile();

    service = module.get<ClipsService>(ClipsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
