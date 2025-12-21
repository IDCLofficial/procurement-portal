import { Test, TestingModule } from '@nestjs/testing';
import { MdaService } from './mda.service';

describe('MdaService', () => {
  let service: MdaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MdaService],
    }).compile();

    service = module.get<MdaService>(MdaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
