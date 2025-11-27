import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Request, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { RisksService } from './risks.service';
import { CreateRiskDto } from './dto/create-risk.dto';
import { UpdateRiskStatusDto } from './dto/update-risk-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Risks') // 1. قسم خاص للمخاطر في Swagger
@ApiBearerAuth()  // 2. علامة القفل (يتطلب Token)
@UseGuards(AuthGuard('jwt')) // 3. حماية الكنترولر بالكامل
@Controller('risks')
export class RisksController {
  constructor(private readonly risksService: RisksService) {}

  // --- 1. إنشاء خطر جديد ---
  @Post()
  @ApiOperation({ summary: 'Create a new risk' })
  create(@Body() createRiskDto: CreateRiskDto, @Request() req) {
    // بنبعت الـ User object كله عشان ناخد منه الـ ID والقسم
    return this.risksService.create(createRiskDto, req.user);
  }

  // --- 2. عرض كل المخاطر ---
  @Get()
  @ApiOperation({ summary: 'Get all risks' })
  findAll() {
    return this.risksService.findAll();
  }

  // --- 3. عرض خطر واحد بالتفصيل ---
  @Get(':id')
  @ApiOperation({ summary: 'Get risk details (with timeline & controls)' })
  findOne(@Param('id') id: string) {
    return this.risksService.findOne(id);
  }

  // --- 4. تحديث حالة الخطر (Workflow) ---
  @Patch(':id/status')
  @ApiOperation({ summary: 'Update risk status (BU Head Approval)' })
  updateStatus(
    @Param('id') id: string, 
    @Body() updateRiskStatusDto: UpdateRiskStatusDto,
    @Request() req
  ) {
    return this.risksService.updateStatus(id, updateRiskStatusDto, req.user);
  }

  // --- 5. إضافة تعليق للتايم لاين ---
  @Post(':id/timeline')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add a comment to risk timeline' })
  @ApiBody({ schema: { type: 'object', properties: { comment: { type: 'string' } } } }) // توضيح شكل البودي في Swagger
  addTimelineComment(
    @Param('id') id: string,
    @Body('comment') comment: string,
    @Request() req
  ) {
    return this.risksService.addComment(id, comment, req.user);
  }

  // --- 6. تعيين ضوابط للخطر (Mitigation) ---
  // (Endpoint جديدة عشان نربط الـ Controls)
  @Post(':id/controls')
  @ApiOperation({ summary: 'Assign controls to mitigate risk' })
  @ApiBody({ schema: { type: 'object', properties: { controlIds: { type: 'array', items: { type: 'string' } } } } })
  assignControls(
    @Param('id') id: string,
    @Body('controlIds') controlIds: string[]
  ) {
    // ملحوظة: دي محتاجة تكوني ضيفتي دالة assignControls في السيرفيس
    // لو لسه ما ضيفتيهاش، ممكن تعملي comment للجزء ده مؤقتاً
    // return this.risksService.assignControls(id, controlIds);
    return { message: "Control assignment logic needs to be implemented in service first" };
  }
}