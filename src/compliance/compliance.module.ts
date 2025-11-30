import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ComplianceService } from './compliance.service';
import { ComplianceController } from './compliance.controller';
import { Framework, FrameworkSchema } from './entities/framework.entity';
import { ControlsModule } from '../controls/controls.module'; // لازم نستورده

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Framework.name, schema: FrameworkSchema }]),
    ControlsModule // عشان نقدر نستخدم ControlModel جوه السيرفيس
  ],
  controllers: [ComplianceController],
  providers: [ComplianceService],
})
export class ComplianceModule {}