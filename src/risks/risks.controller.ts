import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { RisksService } from './risks.service';
import { CreateRiskDto } from './dto/create-risk.dto';
import { UpdateRiskStatusDto } from './dto/update-risk-status.dto';
import { FilterRiskDto } from './dto/filter-risk.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Risks')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('risks')
export class RisksController {
  constructor(private readonly risksService: RisksService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Dashboard Stats' })
  getStats() { return this.risksService.getDashboardStats(); }

  @Get('next-id')
  @ApiOperation({ summary: 'Preview Next ID' })
  getNextId() { return this.risksService.getNextId(); }

  @Post()
  @ApiOperation({ summary: 'Create Risk with Tasks' })
  create(@Body() createRiskDto: CreateRiskDto, @Request() req) {
    return this.risksService.create(createRiskDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Filter Risks' })
  findAll(@Query() filterDto: FilterRiskDto) { return this.risksService.findAll(filterDto); }

  @Get(':id')
  @ApiOperation({ summary: 'Get Details' })
  findOne(@Param('id') id: string) { return this.risksService.findOne(id); }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateRiskStatusDto, @Request() req) {
    return this.risksService.updateStatus(id, dto, req.user);
  }

  @Post(':id/timeline')
  addComment(@Param('id') id: string, @Body('comment') comment: string, @Request() req) {
    return this.risksService.addComment(id, comment, req.user);
  }
}