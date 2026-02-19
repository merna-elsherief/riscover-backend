import { Multer } from 'multer';
export interface IFileUploadService {
  uploadFile(file: Express.Multer.File): Promise<any>;
}