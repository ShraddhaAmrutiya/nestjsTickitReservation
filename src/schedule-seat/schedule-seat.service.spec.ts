import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleSeatService } from './schedule-seat.service';

describe('ScheduleSeatService', () => {
  let service: ScheduleSeatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleSeatService],
    }).compile();

    service = module.get<ScheduleSeatService>(ScheduleSeatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
