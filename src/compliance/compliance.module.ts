import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ComplianceService } from './compliance.service';
import { ComplianceController } from './compliance.controller';
import { Framework, FrameworkSchema } from './entities/framework.entity';
// 1. استيراد موديول الضوابط
import { ControlsModule } from '../controls/controls.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Framework.name, schema: FrameworkSchema }]),
    // 2. لازم نضيفه هنا عشان نقدر نستخدم ControlModel جوه السيرفيس 👇
    ControlsModule 
  ],
  controllers: [ComplianceController],
  providers: [ComplianceService],
})
export class ComplianceModule {}