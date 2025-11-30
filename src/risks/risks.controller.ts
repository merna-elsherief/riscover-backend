import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  UseGuards, 
  Request, 
  Query,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { RisksService } from './risks.service';
import { CreateRiskDto } from './dto/create-risk.dto';
import { UpdateRiskStatusDto } from './dto/update-risk-status.dto';
import { FilterRiskDto } from './dto/filter-risk.dto'; // تأكدي إن الملف ده موجود (عملناه في خطوة البحث)
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Risks')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('risks')
export class RisksController {
  constructor(private readonly risksService: RisksService) {}

  // ==========================================
  // 1. Dashboard & Helpers (لازم يكونوا في الأول)
  // ==========================================

  @Get('stats') // الرابط: /risks/stats
  @ApiOperation({ summary: 'Get dashboard statistics (Widgets counts)' })
  getStats() {
    return this.risksService.getDashboardStats();
  }

  @Get('next-id') // الرابط: /risks/next-id
  @ApiOperation({ summary: 'Preview the next available Risk ID (e.g., R-2025-001)' })
  getNextId() {
    return this.risksService.getNextId();
  }

  // ==========================================
  // 2. Main CRUD
  // ==========================================

  @Post()
  @ApiOperation({ summary: 'Create a new risk (Risk Register Submit)' })
  create(@Body() createRiskDto: CreateRiskDto, @Request() req) {
    // بنبعت req.user عشان نسجل مين اللي عمل الـ Entry (createdBy)
    return this.risksService.create(createRiskDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all risks with filters (Search, Owner, Status)' })
  findAll(@Query() filterDto: FilterRiskDto) {
    // بياخد الفلاتر من الرابط ?status=Draft&search=server
    return this.risksService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get risk details with Timeline' })
  findOne(@Param('id') id: string) {
    return this.risksService.findOne(id);
  }

  // ==========================================
  // 3. Workflow & Actions
  // ==========================================

  @Patch(':id/status')
  @ApiOperation({ summary: 'Approve/Reject risk (BU Head Only)' })
  updateStatus(
    @Param('id') id: string, 
    @Body() updateRiskStatusDto: UpdateRiskStatusDto,
    @Request() req
  ) {
    return this.risksService.updateStatus(id, updateRiskStatusDto, req.user);
  }

  @Post(':id/timeline')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add a comment to the timeline' })
  @ApiBody({ schema: { type: 'object', properties: { comment: { type: 'string' } } } })
  addTimelineComment(
    @Param('id') id: string,
    @Body('comment') comment: string,
    @Request() req
  ) {
    return this.risksService.addComment(id, comment, req.user);
  }
}