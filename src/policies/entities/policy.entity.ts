import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// 🔥 السطر ده اللي كان ناقص وبيعمل الإيرور في السيرفس 🔥
export type PolicyDocument = Policy & Document;

// 1. أنواع الوثائق
export enum DocumentType {
  POLICY = 'Policy',
  STANDARD = 'Standard',
  GUIDELINE = 'Guideline',
  PROCEDURE = 'Procedure',
  BASELINE = 'Baseline',
}

// 2. حالة الوثيقة (محدثة حسب الصورة الجديدة)
export enum PolicyStatus {
  DRAFT = 'Draft',
  OPEN = 'Open',
  SUBMIT_FOR_REVIEW = 'Submit for Review',
  REOPEN = 'Reopen',
  CLOSED = 'Closed',
}

// 3. الأولوية
export enum PolicyPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

// 4. أنواع أحداث التايم لاين الجديدة
export enum TimelineEventType {
  SYSTEM = 'System',       // تحديثات أوتوماتيكية زي تغيير الحالة
  COMMENT = 'Comment',     // تعليق عادي أو ملاحظة
  FILE = 'File',           // رفع ملف (PDF, Docx)
  LINK = 'Link',           // إضافة رابط
}

// 5. شكل عنصر التايم لاين المتطور
export class PolicyTimelineEvent {
  @Prop({ type: String, enum: TimelineEventType, required: true })
  type: TimelineEventType;

  @Prop({ required: true })
  performedBy: string; // اسم الشخص (مثال: Khaled Alaa)

  @Prop()
  content?: string; // نص التعليق، أو رسالة النظام، أو الرابط

  @Prop()
  fileName?: string; // لو الحدث رفع ملف، نحفظ اسمه هنا (مثال: 2_20260122.docx)

  @Prop()
  fileUrl?: string; // مسار الملف على السيرفر أو Cloudinary عشان الفرونت يحمله

  @Prop({ default: Date.now })
  timestamp: Date;
}

@Schema({ timestamps: true })
export class Policy extends Document {
  @Prop({ unique: true })
  policyCode: string; // مثال: PS-1

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: String, enum: DocumentType, default: DocumentType.POLICY })
  documentType: DocumentType;

  // Assignee
  @Prop()
  assigneeName: string; // في الصورة ظاهر الاسم "Khaled Alaa"
  
  @Prop()
  assigneeEmail: string;

  @Prop()
  dueDate: Date;

  @Prop({ type: String, enum: PolicyStatus, default: PolicyStatus.DRAFT })
  status: PolicyStatus;

  @Prop({ type: String, enum: PolicyPriority })
  priority: PolicyPriority;

  // Task progress: 0 to 100
  @Prop({ default: 0, min: 0, max: 100 })
  progress: number;

  // Properties: Published vs Draft
  @Prop({ default: false })
  isPublished: boolean;

  // Task tags
  @Prop([String])
  tags: string[];

  // Participants (مجموعة إيميلات أو أسماء)
  @Prop([String])
  participants: string[];

  // Activity Timeline
  @Prop({ type: [PolicyTimelineEvent], default: [] })
  timeline: PolicyTimelineEvent[];
}

export const PolicySchema = SchemaFactory.createForClass(Policy);

// إنشاء الكود التلقائي لو مش موجود
PolicySchema.pre('save', async function (next) {
  if (!this.policyCode) {
    const count = await (this.constructor as any).countDocuments();
    this.policyCode = `PS-${count + 1}`;
  }
  next();
});