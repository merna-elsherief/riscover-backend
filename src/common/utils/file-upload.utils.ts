import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid'; // دي اللي بتعمل الاسم العشوائي

// 1. دالة تسمية الملف (Hashing Logic)
export const editFileName = (req, file, callback) => {
  // بنفصل الامتداد (.pdf) عن الاسم القديم
  const fileExtName = extname(file.originalname);
  
  // بنعمل اسم عشوائي تماماً (مثلاً: 550e8400-e29b...)
  const randomName = uuidv4(); 
  
  // بنركب الاسم الجديد مع الامتداد
  callback(null, `${randomName}${fileExtName}`);
};

// 2. دالة فلترة الملفات (اختياري: عشان نمنع رفع ملفات .exe مثلاً)
export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|pdf|doc|docx)$/)) {
    return callback(new Error('Only image, pdf, and doc files are allowed!'), false);
  }
  callback(null, true);
};

// 3. التجميعة النهائية (Configuration)
export const storageConfig = diskStorage({
  destination: './uploads', // مكان التخزين (هيتعمل أوتوماتيك)
  filename: editFileName,   // استخدام دالة التسمية بتاعتنا
});