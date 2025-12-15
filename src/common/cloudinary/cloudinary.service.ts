import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import toStream = require('streamifier');
import type { Multer } from 'multer';
import { IFileUploadService } from '../interfaces/file-upload.interface'; // استيراد

@Injectable()
export class CloudinaryService implements IFileUploadService {
  async uploadFile(file: Multer.File): Promise<any> {
    return new Promise((  resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'riscover-uploads' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      toStream.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
