import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceExcelService } from './invoice-excel.service';

describe('InvoiceExcelService', () => {
  let service: InvoiceExcelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoiceExcelService],
    }).compile();

    service = module.get<InvoiceExcelService>(InvoiceExcelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
