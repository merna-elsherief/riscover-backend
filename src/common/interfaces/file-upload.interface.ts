import { Multer } from 'multer';
export interface IFileUploadService {
  uploadFile(file: Multer.File): Promise<any>;
}