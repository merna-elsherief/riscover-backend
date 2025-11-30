import { Controller, Get, Post, Body } from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Compliance')
@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Post('frameworks')
  create(@Body() dto: any) { return this.complianceService.create(dto); }

  @Get('dashboard')
  getDashboard() { return this.complianceService.getDashboardStats(); }
}