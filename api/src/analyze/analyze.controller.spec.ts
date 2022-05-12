import { Test, TestingModule } from '@nestjs/testing';
import { AnalyzeController } from './analyze.controller';
import { AnalyzeService } from './analyze.service';

describe('AnalyzeController', () => {
  let controller: AnalyzeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyzeController],
      providers: [AnalyzeService],
    }).compile();

    controller = module.get<AnalyzeController>(AnalyzeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
