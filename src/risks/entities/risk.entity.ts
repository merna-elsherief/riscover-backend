import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { Control } from '../../controls/entities/control.entity';

// استيراد الـ Enums (تأكدي إن الملفات دي موجودة في folder enums)
import { RiskStatus } from '../enums/risk-status.enum';
import { RiskTreatment } from '../enums/risk-treatment.enum';
import { RiskCategory } from '../enums/risk-category.enum';
import { RiskRating } from '../enums/risk-rating.enum';

export type RiskDocument = HydratedDocument<Risk>;

// --- 1. كلاس فرعي لشكل الحدث في التايم لاين ---
@Schema()
export class RiskTimelineItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User; // مين اللي عمل الحركة دي

  @Prop({ required: true })
  action: string; // نوع الحركة (Created, Status Change, Comment)

  @Prop()
  details: string; // تفاصيل (مثلاً: Changed status to Accepted)

  @Prop({ default: Date.now })
  timestamp: Date;
}
const RiskTimelineSchema = SchemaFactory.createForClass(RiskTimelineItem);

// --- 2. كلاس فرعي للخطر المتبقي ---
class ResidualRiskScore {
  @Prop() likelihood: number;
  @Prop() impact: number;
  @Prop() score: number;
  @Prop({ type: String, enum: RiskRating }) rating: RiskRating;
}

// --- 3. الكلاس الأساسي للخطر ---
@Schema({ timestamps: true })
export class Risk {
  // المعلومات الأساسية
  @Prop({ required: true, unique: true })
  siNo: string; // RISK-001

  @Prop({ required: true })
  title: string;

  // 👇 الإضافة الجديدة
  @Prop({ required: true }) 
  affectedSystem: string; // مثال: "Payment Gateway", "HR Portal"

  @Prop()
  description: string;

  @Prop({ type: String, enum: RiskCategory, default: RiskCategory.OPERATIONAL })
  category: RiskCategory;

  // التواريخ الجديدة 📅
  @Prop({ default: Date.now })
  identifiedDate: Date; // تاريخ الاكتشاف

  @Prop()
  dueDate: Date; // تاريخ الاستحقاق

  // العلاقات
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  owner: User;

  @Prop()
  department: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Control' }] })
  controls: Control[];

  // التايم لاين (سجل الأحداث) 🕒
  @Prop({ type: [RiskTimelineSchema], default: [] })
  timeline: RiskTimelineItem[];

  // القرارات والحالة
  @Prop({ type: String, enum: RiskTreatment, default: RiskTreatment.MITIGATE })
  treatmentStrategy: RiskTreatment;

  @Prop({ type: String, enum: RiskStatus, default: RiskStatus.DRAFT })
  status: RiskStatus;

  @Prop()
  acceptanceJustification: string;

  // الحسابات (Inherent Risk)
  @Prop({ min: 1, max: 5, required: true })
  likelihood: number;

  @Prop({ min: 1, max: 5, required: true })
  impact: number;

  @Prop()
  score: number;

  @Prop({ type: String, enum: RiskRating })
  rating: RiskRating;

  // الحسابات (Residual Risk)
  @Prop({ type: ResidualRiskScore })
  residualRisk: ResidualRiskScore;
}

export const RiskSchema = SchemaFactory.createForClass(Risk);

// --- Hooks: معادلات الحساب التلقائي ---
const calculateRating = (score: number): RiskRating => {
  if (score >= 20) return RiskRating.CRITICAL;
  if (score >= 12) return RiskRating.HIGH;
  if (score >= 6) return RiskRating.MEDIUM;
  return RiskRating.LOW;
};

RiskSchema.pre('save', function(next) {
  // حساب الخطر الأصلي
  if (this.likelihood && this.impact) {
    this.score = this.likelihood * this.impact;
    this.rating = calculateRating(this.score);
  }
  // حساب الخطر المتبقي
  if (this.residualRisk && this.residualRisk.likelihood && this.residualRisk.impact) {
    this.residualRisk.score = this.residualRisk.likelihood * this.residualRisk.impact;
    this.residualRisk.rating = calculateRating(this.residualRisk.score);
  }
  next();
});