import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RisksService } from './risks.service';
import { CreateRiskDto } from './dto/create-risk.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Risks Management') // عشان يظهر في Swagger باسم واضح
@Controller('risks')
export class RisksController {
  constructor(private readonly risksService: RisksService) {}

  // 1. إنشاء خطر جديد
  @Post()
  @ApiOperation({ summary: 'Create a new Risk (Auto-calculates Score)' })
  create(@Body() createRiskDto: CreateRiskDto) {
    return this.risksService.create(createRiskDto);
  }

  // 2. عرض كل المخاطر
  @Get()
  @ApiOperation({ summary: 'List all Risks (Populated with Assets & Controls)' })
  findAll() {
    return this.risksService.findAll();
  }

  // 3. عرض تفاصيل خطر واحد
  @Get(':id')
  @ApiOperation({ summary: 'Get Risk details by MongoDB ID' })
  findOne(@Param('id') id: string) {
    return this.risksService.findOne(id);
  }

  // 4. تحديث الخطر (عشان نغير الحالة أو نضيف Residual Score)
  @Patch(':id')
  @ApiOperation({ summary: 'Update Risk (e.g., change status, add treatment)' })
  update(@Param('id') id: string, @Body() updateRiskDto: any) {
    // ملحوظة: استخدمنا any مؤقتاً للتسهيل، الأصح نستخدم UpdateRiskDto
    return this.risksService.update(id, updateRiskDto);
  }

  // 5. مسح الخطر
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Risk' })
  remove(@Param('id') id: string) {
    return this.risksService.remove(id);
  }
}