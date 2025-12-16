import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RiskDocument = Risk & Document;

// --------------------------------------------------------
// 1️⃣  تعريف الـ Timeline (تم إضافة date لحل المشكلة)
// --------------------------------------------------------
export enum RiskStatus {
  DRAFT = 'Draft',
  IN_PROGRESS = 'In Progress',
  CLOSED = 'Closed',
}
@Schema({ timestamps: true })
export class RiskTimeline {
  @Prop({ required: true })
  entryType: string;

  @Prop({ required: true })
  text: string;

  // ✅✅ الحل للايرور TS2353: ضفنا الحقل ده عشان السيرفس تتعرف عليه
  @Prop({ default: Date.now })
  date: Date;
}
const RiskTimelineSchema = SchemaFactory.createForClass(RiskTimeline);

// --------------------------------------------------------
// 2️⃣ تعريف الـ Task كـ Sub-document (عشان تتحفظ مع الـ Risk)
// --------------------------------------------------------
@Schema()
export class MitigationTask {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  assigneeEmail: string;

  @Prop({ required: true })
  dueDate: Date;
}
// بنعمل Schema صغيرة للتاسكات عشان نحطها جوه الـ Risk
const MitigationTaskSchema = SchemaFactory.createForClass(MitigationTask);

// --------------------------------------------------------
// 3️⃣ الـ Risk Entity الأساسية
// --------------------------------------------------------
@Schema({ 
  timestamps: true,
  toJSON: { virtuals: true }, 
  toObject: { virtuals: true }
})
export class Risk {
  @Prop({ unique: true })
  riskCustomId: string;

  @Prop({ required: true })
  riskName: string;

  @Prop()
  description: string;
  

  @Prop({ required: true })
  category: string;

  @Prop()
  impactedSystem: string;

  @Prop({ enum: ['Critical', 'High', 'Medium', 'Low'], default: 'Medium' })
  priority: string;

  @Prop([String])
  assetTags: string[];

  @Prop({ required: true })
  riskOwnerEmail: string;

  @Prop({ required: true })
  securityAnalystEmail: string;

  @Prop()
  existingControl: string;

  // --- Inherent Risk ---
  @Prop({ required: true, min: 1, max: 5 })
  impactScore: number;

  @Prop({ required: true, min: 1, max: 5 })
  likelihoodScore: number;

  @Prop()
  riskRating: number;

  @Prop()
  riskLevel: string;

  // --- Residual Risk ---
  @Prop({ min: 1, max: 5 })
  residualImpactScore: number;

  @Prop({ min: 1, max: 5 })
  residualLikelihoodScore: number;

  @Prop()
  residualRiskRating: number;

  @Prop()
  residualRiskLevel: string; 

  // --- Treatment ---
  @Prop({ required: true })
  treatmentOption: string;

  @Prop()
  remediationPlan: string;

  // ✅✅ هنا التغيير المهم جداً عشان التاسكات تتحفظ
  // بدل Virtual، خليناها Array of Schema حقيقية
  @Prop({ type: [MitigationTaskSchema], default: [] })
  mitigationTasks: MitigationTask[];

  @Prop()
  resourcesRequired: string;

  @Prop({ default: false })
  autoReminders: boolean;

  @Prop()
  remediationPlanSummary: string;

  @Prop({ required: true })
  dueDate: Date;

@Prop({ 
    required: true, 
    enum: RiskStatus, 
    default: RiskStatus.DRAFT // القيمة الافتراضية لو محدش بعت حاجة
  })
  status: string;

  @Prop({ type: [RiskTimelineSchema], default: [] })
  timeline: RiskTimeline[];
}

export const RiskSchema = SchemaFactory.createForClass(Risk);