import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RisksService } from './risks.service';
import { RisksController } from './risks.controller';
import { Risk, RiskSchema } from './entities/risk.entity';

@Module({
  imports: [
    // هنا بنعرف الموديل عشان Mongoose يفهمه
    MongooseModule.forFeature([{ name: Risk.name, schema: RiskSchema }]),
  ],
  controllers: [RisksController],
  providers: [RisksService],
  exports: [RisksService],
})
export class RiskModule {}