import { Test, TestingModule } from '@nestjs/testing';
import { RateCardTemplateController } from './rate-card-template.controller';

describe('RateCardTemplateController', () => {
  let controller: RateCardTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RateCardTemplateController],
    }).compile();

    controller = module.get<RateCardTemplateController>(RateCardTemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
