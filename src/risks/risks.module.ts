import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RisksService } from './risks.service';
import { RisksController } from './risks.controller';
import { Risk, RiskSchema } from './entities/risk.entity';
// import { CommonModule } from '../common/common.module'; // لو عملتي موديول العداد

@Module({
  imports: [
    // 1. تعريف جدول المخاطر
    MongooseModule.forFeature([{ name: Risk.name, schema: RiskSchema }]),
    
    // 2. استيراد موديول العدادات (عشان نعرف نعمل RISK-001)
    // CommonModule,  <-- فعلي السطر ده لو كنتي عملتي CommonModule المرة اللي فاتت
  ],
  controllers: [RisksController],
  providers: [RisksService],
})
export class RisksModule {}