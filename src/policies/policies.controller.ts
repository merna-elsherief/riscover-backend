import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, UsePipes, ValidationPipe, UseInterceptors, UploadedFile, Req
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';

import { PoliciesService } from './policies.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { AddTimelineEventDto } from './dto/add-timeline-event.dto';
import { TimelineEventType } from './entities/policy.entity';

// 👇 تأكدي إن مسار Cloudinary هنا مطابق للي عندك في البروجيكت
import { CloudinaryService } from '../common/cloudinary/cloudinary.service'; 

@ApiTags('policies')
@ApiBearerAuth()
@Controller('policies')
export class PoliciesController {
  constructor(
    private readonly policiesService: PoliciesService,
    private readonly cloudinaryService: CloudinaryService 
  ) {}

  // 1. Get Next Code
  @Get('next-code')
  @ApiOperation({ summary: 'Get the next policy code (e.g. PS-15)' })
  getNextCode() {
    return this.policiesService.getNextPolicyCodeForDisplay();
  }

  // 2. Create Policy
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new policy document' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createPolicyDto: CreatePolicyDto, @Req() req: any) {
    const userName = req.user?.email || 'System User'; // استخراج اسم اليوزر من التوكن
    return this.policiesService.create(createPolicyDto, userName);
  }

  // 3. Get All
  @Get()
  @ApiOperation({ summary: 'Get all policies' })
  findAll() {
    return this.policiesService.findAll();
  }

  // 4. Get One
  @Get(':id')
  @ApiOperation({ summary: 'Get a single policy by ID' })
  findOne(@Param('id') id: string) {
    return this.policiesService.findOne(id);
  }

  // 5. Update Policy
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update a policy' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(@Param('id') id: string, @Body() updatePolicyDto: UpdatePolicyDto, @Req() req: any) {
    const userName = req.user?.email || 'System User';
    return this.policiesService.update(id, updatePolicyDto, userName);
  }

  // 6. Delete Policy
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete a policy' })
  remove(@Param('id') id: string) {
    return this.policiesService.remove(id);
  }

  // ==========================================================
  // 🔥 Endpoints الخاصة بالـ Timeline (تعليقات، لينكات، ملفات) 🔥
  // ==========================================================

  // 7. إضافة تعليق (Notes) أو رابط (Link) للتايم لاين
  @Post(':id/timeline/comment')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Add a text comment or link to the policy timeline' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  addTimelineComment(
    @Param('id') id: string, 
    @Body() eventDto: AddTimelineEventDto,
    @Req() req: any
  ) {
    const userName = req.user?.email || 'System User';
    return this.policiesService.addTimelineEvent(id, eventDto, userName);
  }

  // 8. رفع ملف (Upload File) للتايم لاين عبر Cloudinary ☁️
  @Post(':id/timeline/upload')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Upload a file to the policy timeline (PDF, DOCX) via Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file')) // شلنا إعدادات الحفظ المحلي
  async uploadTimelineFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any
  ) {
    const userName = req.user?.email || 'System User';

    // 1. رفع الملف لـ Cloudinary
    const uploadResult = await this.cloudinaryService.uploadFile(file);

    // 2. تجهيز بيانات الحدث برابط Cloudinary الآمن
    const fileEvent: AddTimelineEventDto = {
      type: TimelineEventType.FILE,
      content: 'has uploaded evidence file.',
      fileName: file.originalname, // اسم الملف الأصلي
      fileUrl: uploadResult.secure_url, // الرابط الراجع من Cloudinary
    };

    // 3. حفظ الحدث في الداتابيز
    return this.policiesService.addTimelineEvent(id, fileEvent, userName);
  }
}