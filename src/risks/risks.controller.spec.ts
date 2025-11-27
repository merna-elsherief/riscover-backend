import { Test, TestingModule } from '@nestjs/testing';
import { RisksController } from './risks.controller';
import { RisksService } from './risks.service';

describe('RisksController', () => {
  let controller: RisksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RisksController],
      providers: [RisksService],
    }).compile();

    controller = module.get<RisksController>(RisksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
