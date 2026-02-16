import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// 1. أنواع الوثائق (من المنيو اللي على الشمال)
export enum DocumentType {
  POLICY = 'Policy',
  STANDARD = 'Standard',
  GUIDELINE = 'Guideline',
  PROCEDURE = 'Procedure',
  BASELINE = 'Baseline',
}

// 2. حالة الوثيقة (من الجدول والتفاصيل)
export enum PolicyStatus {
  DRAFT = 'Draft',
  ACTIVE = 'Active',
  UNDER_REVIEW = 'Under Review',
  OPEN = 'Open',
  REOPENED = 'Reopened',
  CLOSED = 'Closed',
}

// 3. الأولوية
export enum PolicyPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

// 4. شكل عنصر التايم لاين
export class PolicyTimelineEvent {
  @Prop({ required: true })
  action: string; // مثال: "Assessment updated (Impact: 3 -> 4)"

  @Prop({ required: true })
  performedBy: string; // الإيميل أو اسم الشخص

  @Prop({ default: Date.now })
  timestamp: Date;
}

@Schema({ timestamps: true })
export class Policy extends Document {
  // الكود المميز (مثال: ISP-01 أو PS-1)
  @Prop({ unique: true })
  policyCode: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: String, enum: DocumentType, default: DocumentType.POLICY })
  documentType: DocumentType;

  // الفريم ووركس (ISO27001, NIST, GDPR...)
  @Prop([String])
  frameworksMapped: string[];

  // المالك (مثلاً: CISO)
  @Prop()
  owner: string;

  // الشخص المعين حالياً للمراجعة (Assignee)
  @Prop()
  assigneeEmail: string;

  // المشاركين (Participants) - مجموعة إيميلات
  @Prop([String])
  participants: string[];

  @Prop()
  dueDate: Date; // تاريخ الاستحقاق / المراجعة

  @Prop({ default: 'v1.0' })
  version: string;

  @Prop({ type: String, enum: PolicyStatus, default: PolicyStatus.DRAFT })
  status: PolicyStatus;

  @Prop({ type: String, enum: PolicyPriority })
  priority: PolicyPriority;

  // شريط التقدم (Task progress) من 0 لـ 100
  @Prop({ default: 0, min: 0, max: 100 })
  progress: number;

  // الخصائص (Properties: Published / Draft)
  @Prop({ default: false })
  isPublished: boolean;

  // التاجز (Task tag)
  @Prop([String])
  tags: string[];

  // Activity Timeline 🚀
  @Prop({ type: [PolicyTimelineEvent], default: [] })
  timeline: PolicyTimelineEvent[];
}

export const PolicySchema = SchemaFactory.createForClass(Policy);

// Middleware عشان نعمل كود أوتوماتيك لو مفيش كود مبعوت (زي PS-1)
PolicySchema.pre('save', async function (next) {
  if (!this.policyCode) {
    const count = await (this.constructor as any).countDocuments();
    this.policyCode = `PS-${count + 1}`;
  }
  next();
});