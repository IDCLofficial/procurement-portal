import { Test, TestingModule } from '@nestjs/testing';
import { MdaController } from './mda.controller';
import { MdaService } from './mda.service';

describe('MdaController', () => {
  let controller: MdaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MdaController],
      providers: [MdaService],
    }).compile();

    controller = module.get<MdaController>(MdaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
