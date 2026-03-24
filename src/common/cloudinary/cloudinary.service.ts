import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'grc_policies_evidence', // اسم الفولدر اللي هيتكريت في Cloudinary
          resource_type: 'auto', // 🔥 مهم جداً عشان يقبل PDF و Word مش صور بس
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      // تحويل الملف لـ Stream ورفعه فوراً بدون حفظه على السيرفر
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}