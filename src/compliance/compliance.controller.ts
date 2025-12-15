import { Controller, Get, Post, Body } from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { CreateFrameworkDto } from './dto/create-framework.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Compliance Dashboard')
@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Dashboard Statistics (Scores)' })
  getDashboard() {
    return this.complianceService.getDashboardStats();
  }

  @Post('frameworks')
  @ApiOperation({ summary: 'Define a new Framework' })
  create(@Body() createDto: CreateFrameworkDto) {
    return this.complianceService.create(createDto);
  }

  @Get('frameworks')
  findAll() {
    return this.complianceService.findAll();
  }
}