import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RiskDocument = Risk & Document;

// التايم لاين زي ما هو
@Schema({ timestamps: true })
export class RiskTimeline {
  @Prop({ required: true })
  entryType: string;

  @Prop({ required: true })
  text: string;
}
const RiskTimelineSchema = SchemaFactory.createForClass(RiskTimeline);

@Schema({ timestamps: true })
export class Risk {
  @Prop({ unique: true })
  riskCustomId: string; // R-2025-001

  // 1. Risk Name
  @Prop({ required: true })
  riskName: string;

  // ✅ 2. Description (موجود أهو)
  @Prop()
  description: string;

  // ✅ 3. Category (موجود)
  @Prop({ required: true })
  category: string;

  // ✅ 4. Impacted System (موجود)
  @Prop()
  impactedSystem: string;

  // ✅ 5. Priority (تمت إضافتها كحقل منفصل حسب طلبك)
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

  @Prop({ required: true, min: 1, max: 5 })
  impactScore: number;

  @Prop({ required: true, min: 1, max: 5 })
  likelihoodScore: number;

  // ده المحسوب (Rating = Impact * Likelihood)
  @Prop()
  riskRating: number;

  // ده المحسوب (Level)
  @Prop()
  riskLevel: string;

  @Prop({ required: true })
  treatmentOption: string;

  // ✅ 6. Remediation Plan (موجود كنص)
  @Prop()
  remediationPlan: string;

  @Prop()
  resourcesRequired: string;

  // ✅ 7. Auto Reminders (موجود)
  @Prop({ default: false })
  autoReminders: boolean;

  @Prop()
  remediationPlanSummary: string;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ default: 'Draft' })
  status: string;

  @Prop({ type: [RiskTimelineSchema], default: [] })
  timeline: RiskTimeline[];
}

export const RiskSchema = SchemaFactory.createForClass(Risk);