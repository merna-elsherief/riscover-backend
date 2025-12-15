import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME || 'riscover',
      api_key: process.env.CLOUDINARY_API_KEY || '461222975332549',
      api_secret: process.env.CLOUDINARY_API_SECRET || 'ahByCfSLeFpLH7CVfVAKJtCoh4k',
    });
  },
};