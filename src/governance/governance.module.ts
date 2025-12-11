import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GovernanceService } from './governance.service';
import { GovernanceController } from './governance.controller';
import { GovernanceDocument, GovernanceDocumentSchema } from './entities/governance-document.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: GovernanceDocument.name, schema: GovernanceDocumentSchema }])
  ],
  controllers: [GovernanceController],
  providers: [GovernanceService],
  exports: [GovernanceService] // عشان لو حبينا نربطه بـ Controls
})
export class GovernanceModule {}