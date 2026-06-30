import { Test, TestingModule } from '@nestjs/testing';
import { RateCardTemplateService } from './rate-card-template.service';

describe('RateCardTemplateService', () => {
  let service: RateCardTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RateCardTemplateService],
    }).compile();

    service = module.get<RateCardTemplateService>(RateCardTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
