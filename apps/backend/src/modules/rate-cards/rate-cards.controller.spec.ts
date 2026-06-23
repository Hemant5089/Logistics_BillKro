import { Test, TestingModule } from '@nestjs/testing';
import { RateCardsController } from './rate-cards.controller';

describe('RateCardsController', () => {
  let controller: RateCardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RateCardsController],
    }).compile();

    controller = module.get<RateCardsController>(RateCardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
