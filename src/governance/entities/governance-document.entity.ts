import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { DocumentType } from '../enums/document-type.enum';
import { DocumentStatus } from '../enums/document-status.enum';
import { Priority } from '../enums/priority.enum'; // 🆕

export type GovernanceDocumentDocument = HydratedDocument<GovernanceDocument>;

// 🆕 كلاس فرعي للـ Activity Timeline (السجل اللي تحت في الصورة)
@Schema()
class ActivityLog {
  @Prop() action: string; // e.g., "Assessment updated"
  @Prop() user: string;   // "Khaled Alaa"
  @Prop({ default: Date.now }) date: Date;
  @Prop() details: string; // "Impact changed from 3 to 4"
}

@Schema({ timestamps: true })
export class GovernanceDocument {
  // ... (الحقول القديمة: code, title, description زي ما هي)
  @Prop({ required: true, unique: true }) code: string;
  @Prop({ required: true }) title: string;
  @Prop() description: string;
  @Prop({ type: String, enum: DocumentType }) type: DocumentType;
  @Prop() fileUrl: string;

  // --- 🆕 التحديثات الجديدة بناءً على الصور ---

  // 1. Workflow & Progress
  @Prop({ type: String, enum: DocumentStatus, default: DocumentStatus.OPEN })
  status: DocumentStatus;

  @Prop({ type: String, enum: Priority, default: Priority.MEDIUM })
  priority: Priority;

  @Prop({ min: 0, max: 100, default: 0 })
  progress: number; // Slider (0-100)

  // 2. People (Assignee vs Owner vs Participants)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  owner: User; // الشخص اللي عمل الملف (Creator)

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  assignee: User; // الشخص المسؤول حالياً (Khaled Alaa)

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  participants: User[]; // الناس اللي في الدوائر الصغيرة

  // 3. Dates
  @Prop() dueDate: Date;
  @Prop() lastReviewDate: Date;
  @Prop() nextReviewDate: Date;

  // 4. Extras
  @Prop({ type: [String] }) 
  tags: string[]; // ["Add", "Security"]

  @Prop({ type: [ActivityLog], default: [] })
  activityTimeline: ActivityLog[]; // السجل التاريخي
}

export const GovernanceDocumentSchema = SchemaFactory.createForClass(GovernanceDocument);