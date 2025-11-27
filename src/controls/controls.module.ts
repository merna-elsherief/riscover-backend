import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // 1
import { ControlsService } from './controls.service';
import { ControlsController } from './controls.controller';
import { Control, ControlSchema } from './entities/control.entity'; // 2

@Module({
  imports: [
    // 3. الربط
    MongooseModule.forFeature([{ name: Control.name, schema: ControlSchema }]),
  ],
  controllers: [ControlsController],
  providers: [ControlsService],
  exports: [ControlsService] // مهم: عشان الـ Risk Module يقدر يشوفه
})
export class ControlsModule {}