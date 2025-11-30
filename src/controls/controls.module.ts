import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ControlsService } from './controls.service';
import { ControlsController } from './controls.controller';
import { Control, ControlSchema } from './entities/control.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Control.name, schema: ControlSchema }])],
  controllers: [ControlsController],
  providers: [ControlsService],
  exports: [ControlsService, MongooseModule] // بنصدر الموديل عشان Compliance يستخدمه
})
export class ControlsModule {}