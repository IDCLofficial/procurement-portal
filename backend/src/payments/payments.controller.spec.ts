import { Test, TestingModule } from '@nestjs/testing';
import { SplitPaymentController } from './payments.controller';
import { SplitPaymentService } from './payments.service';

describe('PaymentsController', () => {
  let controller: SplitPaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SplitPaymentController],
      providers: [SplitPaymentService],
    }).compile();

    controller = module.get<SplitPaymentController>(SplitPaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
