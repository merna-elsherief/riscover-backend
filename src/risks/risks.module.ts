import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RisksService } from './risks.service';
import { RisksController } from './risks.controller';
import { Risk, RiskSchema } from './entities/risk.entity';
// ✅ 1. استيراد AuthModule (تأكدي من المسار صح)
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Risk.name, schema: RiskSchema }]),
    // ✅ 2. إضافة AuthModule هنا عشان الموديول ده يقدر يستخدم الـ Guards
    AuthModule, 
  ],
  controllers: [RisksController],
  providers: [RisksService],
  exports: [RisksService],
})
export class RiskModule {}