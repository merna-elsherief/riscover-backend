import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // الحارس
import { RisksService } from './risks.service';
import { CreateRiskDto } from './dto/create-risk.dto';
import { Patch } from '@nestjs/common'; // زودي Patch في الـ Imports
import { UpdateRiskStatusDto } from './dto/update-risk-status.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'; // استيراد

@ApiTags('Risks') // 1. بيعمل قسم اسمه Risks في الصفحة
@ApiBearerAuth()  // 2. بيحط علامة القفل على كل الـ Endpoints دي
@Controller('risks')
export class RisksController {
  constructor(private readonly risksService: RisksService) {}

  @UseGuards(AuthGuard('jwt')) // 1. ممنوع الدخول بدون توكن
  @Post()
  @ApiOperation({ summary: 'Create a new risk' }) // 3. وصف لما تقفي على الزرار
  create(@Body() createRiskDto: CreateRiskDto, @Request() req) {
    // 2. req.user شايل البيانات اللي رجعناها من JwtStrategy (userId, department)
    return this.risksService.create(createRiskDto, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.risksService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.risksService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/status') // الرابط هيكون: /risks/RISK_ID/status
  updateStatus(
    @Param('id') id: string, 
    @Body() updateDto: UpdateRiskStatusDto,
    @Request() req
  ) {
    return this.risksService.updateStatus(id, updateDto, req.user);
  }
}