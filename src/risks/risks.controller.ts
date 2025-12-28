import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UsePipes, ValidationPipe, UseGuards // ✅ 1. استيراد UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // ✅ 2. استيراد AuthGuard
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'; // ✅ 3. استيراد ApiBearerAuth
import { RisksService } from './risks.service';
import { CreateRiskDto } from './dto/create-risk.dto';
import { UpdateRiskDto } from './dto/update-risk.dto';
import { UpdateRiskStatusDto } from './dto/update-risk-status.dto';

@ApiTags('risks')
@ApiBearerAuth() // ✅ عشان Swagger يظهر زرار القفل
@Controller('risks')
export class RisksController {
  constructor(private readonly risksService: RisksService) {}

  // 1️⃣ Create Risk (محمي 🔒)
  @Post()
  @ApiOperation({ summary: 'Create a new risk with tasks & scores' })
  @ApiResponse({ status: 201, description: 'The risk has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Validation Error (Check tasks or scores)' })
  @UseGuards(AuthGuard('jwt')) // ✅ لازم توكن عشان ينشئ خطر
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true })) 
  create(@Body() createRiskDto: CreateRiskDto) {
    return this.risksService.create(createRiskDto);
  }

  // 2️⃣ Get All Risks (مفتوح للقراءة 🔓 - اختياري)
  @Get()
  @ApiOperation({ summary: 'Get all risks' })
  // @UseGuards(AuthGuard('jwt')) // 👈 شيلي الكومنت لو عايزة تقفلي القراءة كمان
  findAll() {
    return this.risksService.findAll();
  }

  // 3️⃣ Get Next ID (Action)
  @Get('next-id')
  @ApiOperation({ summary: 'Get the next auto-generated ID (e.g. R-2025-004)' })
  getNextId() {
    return this.risksService.getNextIdForDisplay();
  }

  // 4️⃣ Get One Risk (مفتوح للقراءة 🔓)
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific risk by MongoDB ID' })
  findOne(@Param('id') id: string) {
    return this.risksService.findOne(id);
  }

  // 5️⃣ Update Risk (محمي 🔒)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a risk (Supports updating tasks & residual scores)' })
  @UseGuards(AuthGuard('jwt')) // ✅ لازم توكن للتعديل
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(@Param('id') id: string, @Body() updateRiskDto: UpdateRiskDto) {
    return this.risksService.update(id, updateRiskDto);
  }

  // 6️⃣ Update Status Only (محمي 🔒)
  @Patch(':id/status') 
  @ApiOperation({ summary: 'Update risk status only' })
  @UseGuards(AuthGuard('jwt')) // ✅ لازم توكن لتغيير الحالة
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  updateStatus(
    @Param('id') id: string, 
    @Body() updateRiskStatusDto: UpdateRiskStatusDto
  ) {
    return this.risksService.updateStatus(id, updateRiskStatusDto.status);
  }

  // 7️⃣ Delete Risk (محمي 🔒)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a risk' })
  @UseGuards(AuthGuard('jwt')) // ✅ لازم توكن للحذف
  remove(@Param('id') id: string) {
    return this.risksService.remove(id);
  }
}