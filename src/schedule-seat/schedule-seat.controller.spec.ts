import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleSeatController } from './schedule-seat.controller';
import { ScheduleSeatService } from './schedule-seat.service';

describe('ScheduleSeatController', () => {
  let controller: ScheduleSeatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleSeatController],
      providers: [ScheduleSeatService],
    }).compile();

    controller = module.get<ScheduleSeatController>(ScheduleSeatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
