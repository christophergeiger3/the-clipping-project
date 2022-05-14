import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('getStatus', () => {
    it('should return "The clips API is up and running!"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getStatus()).toBe(
        'The clips API is up and running!',
      );
    });
  });
});
