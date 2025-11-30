import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity';

// استيراد الـ Enums المنظمة
import { RiskPriority } from '../enums/risk-priority.enum';
import { RiskTreatment } from '../enums/risk-treatment.enum';
import { RiskCategory } from '../enums/risk-category.enum';

export type RiskDocument = HydratedDocument<Risk>;

// كلاس التايم لاين (زي ما هو)
@Schema()
export class RiskTimelineItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User; // مين اللي عمل التغيير (Log in user)
  @Prop() action: string;
  @Prop() details: string;
  @Prop({ default: Date.now }) timestamp: Date;
}
const RiskTimelineSchema = SchemaFactory.createForClass(RiskTimelineItem);

@Schema({ timestamps: true })
export class Risk {
  // --- 1. Risk Identification ---
  @Prop({ required: true, unique: true })
  siNo: string; // الشكل الجديد: R-2025-001

  @Prop({ required: true })
  title: string; // Risk Name

  @Prop()
  description: string;

  @Prop({ type: String, enum: RiskCategory, default: RiskCategory.SECURITY })
  category: RiskCategory;

  // --- 2. Assets & Systems (مؤقتاً نصوص) ---
  @Prop({ type: [String], default: [] })
  assetTags: string[]; // مصفوفة كلمات

  @Prop()
  affectedSystem: string; // Impacted System

  // --- 3. المسؤولين (Emails مؤقتاً) ---
  @Prop()
  riskOwnerEmail: string; // الإيميل اللي هيتكتب في الفورم

  @Prop()
  securityAnalystEmail: string; // إيميل المحلل

  // ده الشخص اللي "أنشأ" الخطر فعلياً (System User) - عشان الـ Audit
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy: User;

  // --- 4. التقييم (Assessment) ---
  @Prop({ min: 1, max: 5, required: true })
  impact: number;

  @Prop({ min: 1, max: 5, required: true })
  likelihood: number;

  @Prop()
  score: number; // Rating (محسوب)

  // --- 5. المعالجة والأولوية ---
  @Prop({ type: String, enum: RiskPriority, default: RiskPriority.MEDIUM })
  priority: RiskPriority; // Manual Priority Selection

  @Prop({ type: String, enum: RiskTreatment, default: RiskTreatment.MITIGATE })
  treatmentStrategy: RiskTreatment;

  @Prop()
  remediationPlan: string;

  @Prop()
  remediationPlanSummary: string;

  @Prop()
  resourcesRequired: string;

  @Prop()
  dueDate: Date;

  @Prop({ default: false })
  automaticReminders: boolean;

  // --- 6. السجل ---
  @Prop({ type: [RiskTimelineSchema], default: [] })
  timeline: RiskTimelineItem[];
  
  // الحالة (Draft, etc..) لسه موجودة
  @Prop({ default: 'Draft' })
  status: string;
}

export const RiskSchema = SchemaFactory.createForClass(Risk);

// معادلة حساب الـ Score
RiskSchema.pre('save', function(next) {
  if (this.likelihood && this.impact) {
    this.score = this.likelihood * this.impact;
  }
  next();
});