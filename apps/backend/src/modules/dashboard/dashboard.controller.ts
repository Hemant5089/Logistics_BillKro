import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Public } from '../auth/decorators/public.decorator';


@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  @Public()
  @Get('stats')
  async getStats() {
    return this.dashboardService.getStats();
  }
}