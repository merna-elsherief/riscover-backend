import { Module } from '@nestjs/common';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';
import { CloudinaryProvider } from './cloudinary/cloudinary.provider'; // 👈 جديد
import { CloudinaryService } from './cloudinary/cloudinary.service';   // 👈 جديد
import { MongooseModule } from '@nestjs/mongoose';
import { Counter, CounterSchema } from './entities/counter.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Counter.name, schema: CounterSchema }]),
  ],
  controllers: [CommonController],
  providers: [
    CommonService, 
    CloudinaryProvider, // 👈 تسجيل
    {
      provide: 'UPLOAD_SERVICE',
      useClass: CloudinaryService, 
    }   // 👈 تسجيل
  ],
  exports: [CommonService, 'UPLOAD_SERVICE'],
})
export class CommonModule {}