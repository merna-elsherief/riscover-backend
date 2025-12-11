import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { Asset } from '../../assets/entities/asset.entity';
import { Control } from '../../controls/entities/control.entity';
import { RiskCategory, RiskStrategy, RiskStatus, RiskLevel } from '../enums/risk-enums';

export type RiskDocument = HydratedDocument<Risk>;

@Schema({ timestamps: true })
export class Risk {
  // --- 1. Identification ---
  @Prop({ required: true, unique: true })
  riskId: string; // Auto-generated: R-2025-001

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: String, enum: RiskCategory })
  category: RiskCategory;

  // --- 2. Linkage (الربط) ---
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Asset' }] })
  affectedAssets: Asset[]; // الخطر ده على انهي أجهزة؟

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  owner: User; // مين المسؤول عن الخطر ده؟

  // --- 3. Inherent Risk Assessment (الخطر الخام - قبل العلاج) ---
  @Prop({ min: 1, max: 5 })
  inherentLikelihood: number; // احتمالية (1-5)

  @Prop({ min: 1, max: 5 })
  inherentImpact: number;     // تأثير (1-5)

  @Prop()
  inherentScore: number;      // (Calculated: L x I)

  @Prop({ type: String, enum: RiskLevel })
  inherentLevel: RiskLevel;   // (Calculated: High, Critical...)

  // --- 4. Treatment (العلاج) ---
  @Prop({ type: String, enum: RiskStrategy, default: RiskStrategy.MITIGATE })
  treatmentStrategy: RiskStrategy;

  // الضوابط اللي هنطبقها عشان نعالج الخطر
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Control' }] })
  mitigatingControls: Control[]; 

  // --- 5. Residual Risk Assessment (الخطر المتبقي - بعد العلاج) ---
  // بنسيبه فاضي لحد ما نطبق الضوابط ونقيم تاني
  @Prop({ min: 1, max: 5 })
  residualLikelihood: number;

  @Prop({ min: 1, max: 5 })
  residualImpact: number;

  @Prop()
  residualScore: number;

  @Prop({ type: String, enum: RiskLevel })
  residualLevel: RiskLevel;

  // --- 6. Status ---
  @Prop({ type: String, enum: RiskStatus, default: RiskStatus.DRAFT })
  status: RiskStatus;
}

export const RiskSchema = SchemaFactory.createForClass(Risk);