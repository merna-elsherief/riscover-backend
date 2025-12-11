import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RisksService } from './risks.service';
import { RisksController } from './risks.controller';
import { Risk, RiskSchema } from './entities/risk.entity';
// ⚠️ هام جداً: استيراد CommonModule عشان الـ IDs
import { CommonModule } from '../common/common.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Risk.name, schema: RiskSchema }]),
    CommonModule // 👈 لازم يكون هنا
  ],
  controllers: [RisksController],
  providers: [RisksService],
  exports: [RisksService] // عشان لو الـ Compliance احتاجه قدام
})
export class RisksModule {}