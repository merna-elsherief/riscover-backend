import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PoliciesService } from './policies.service';
import { PoliciesController } from './policies.controller';
import { Policy, PolicySchema } from './entities/policy.entity';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module'; // 👈 استيراد الموديول الجديد

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Policy.name, schema: PolicySchema }]),
    AuthModule,
    CloudinaryModule, // 👈 إضافته هنا
  ],
  controllers: [PoliciesController],
  providers: [PoliciesService],
  exports: [PoliciesService]
})
export class PoliciesModule {}