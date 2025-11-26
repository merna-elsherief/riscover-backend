import { Test, TestingModule } from '@nestjs/testing';
import { ControlsController } from './controls.controller';
import { ControlsService } from './controls.service';

describe('ControlsController', () => {
  let controller: ControlsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ControlsController],
      providers: [ControlsService],
    }).compile();

    controller = module.get<ControlsController>(ControlsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
