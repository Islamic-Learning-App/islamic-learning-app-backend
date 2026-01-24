import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return status up', () => {
      expect(appController.getHealth()).toEqual({
        status: 'up',
        uptime: expect.any(Number) as number,
        timestamp: expect.any(String) as string,
      });
    });
  });
});
