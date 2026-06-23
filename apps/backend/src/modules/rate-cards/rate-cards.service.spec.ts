import { Test, TestingModule } from '@nestjs/testing';
import { RateCardsService } from './rate-cards.service';

describe('RateCardsService', () => {
  let service: RateCardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RateCardsService],
    }).compile();

    service = module.get<RateCardsService>(RateCardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
