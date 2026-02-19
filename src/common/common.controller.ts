import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  Inject, 
  BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';
import {Multer} from 'multer';
import type { IFileUploadService } from './interfaces/file-upload.interface'; // تأكدي إن الملف ده موجود

@ApiTags('Common / Uploads')
@Controller('common')
export class CommonController {
  
  constructor(
    // 💉 بنحقن الخدمة بالاسم المستعار عشان المرونة (سواء كانت Cloudinary أو Local أو S3)
    @Inject('UPLOAD_SERVICE') private readonly uploadService: IFileUploadService
  ) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a file (Returns a URL)' })
  @ApiConsumes('multipart/form-data') // عشان Swagger يفهم إنه رفع ملف
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary', // بيظهر زرار الـ Upload في Swagger
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file')) // 'file' هو اسم الحقل اللي في الفورم
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // الكنترولر ميعرفش مين بينفذ، هو بينده الدالة وخلاص
    const result = await this.uploadService.uploadFile(file);
    
    return {
      message: 'File uploaded successfully',
      // Cloudinary بيرجع secure_url، لو خدمة تانية ممكن ترجع url بس
      url: result.secure_url || result.url, 
      filename: result.public_id || result.filename
    };
  }
}