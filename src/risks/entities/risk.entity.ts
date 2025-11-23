import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity'; // تأكدي من المسار
import { RiskStatus } from '../enums/risk-status.enum';

export type RiskDocument = HydratedDocument<Risk>;

@Schema({ timestamps: true }) // بيضيف createdAt و updatedAt أوتوماتيك
export class Risk {
  // 1. الرقم المميز (زي RISK-001)
  @Prop({ required: true, unique: true })
  siNo: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  // 2. العلاقة مع اليوزر (مين اللي عمل الخطر؟)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  owner: User;

  @Prop()
  department: string; // قسم الـ IT, HR, etc.

  // 3. الحسابات (Matrix 5x5)
  @Prop({ min: 1, max: 5, required: true })
  likelihood: number;

  @Prop({ min: 1, max: 5, required: true })
  impact: number;

  @Prop()
  score: number; // النتيجة (Likelihood * Impact)

  @Prop({ 
    type: String, 
    enum: RiskStatus, 
    default: RiskStatus.DRAFT 
    })
  status: RiskStatus;
}

export const RiskSchema = SchemaFactory.createForClass(Risk);

// Hook: قبل الحفظ، احسب الـ Score أوتوماتيك
RiskSchema.pre('save', function(next) {
  if (this.likelihood && this.impact) {
    this.score = this.likelihood * this.impact;
  }
  next();
});