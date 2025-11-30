import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { ControlType } from '../enums/control-type.enum';
import { ControlStatus } from '../enums/control-status.enum';

export type ControlDocument = HydratedDocument<Control>;

// 1. Evidence Sub-document (الملفات المرفوعة)
@Schema()
export class EvidenceItem {
  @Prop() fileName: string;
  @Prop() fileUrl: string;
  @Prop() uploadedBy: string;
  @Prop({ default: Date.now }) uploadDate: Date;
  @Prop() period: string; // Q1, Q2...
}
const EvidenceSchema = SchemaFactory.createForClass(EvidenceItem);

// 2. Timeline Sub-document
@Schema()
export class ControlTimelineItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' }) user: User;
  @Prop() action: string;
  @Prop({ default: Date.now }) timestamp: Date;
}
const ControlTimelineSchema = SchemaFactory.createForClass(ControlTimelineItem);

// 3. Main Entity
@Schema({ timestamps: true })
export class Control {
  @Prop({ required: true, unique: true }) code: string; // A.8.1.1
  @Prop({ required: true }) name: string;
  @Prop() description: string;
  
  @Prop({ required: true }) framework: string; // ISO 27001
  @Prop({ default: 'General' }) domain: string;

  @Prop({ type: String, enum: ControlType, default: ControlType.PREVENTIVE })
  type: ControlType;

  @Prop({ type: String, enum: ControlStatus, default: ControlStatus.NOT_STARTED })
  status: ControlStatus;

  // KPIs (من صورة التفاصيل)
  @Prop() objective: string;
  @Prop() target: string; // 100%
  @Prop() actualAchievement: string; // 87%
  
  // Lists
  @Prop({ type: [String] }) linkedPolicies: string[];
  @Prop({ type: [EvidenceSchema], default: [] }) evidence: EvidenceItem[];
  @Prop({ type: [ControlTimelineSchema], default: [] }) timeline: ControlTimelineItem[];
}

export const ControlSchema = SchemaFactory.createForClass(Control);