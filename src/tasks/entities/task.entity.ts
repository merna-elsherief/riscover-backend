import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Risk } from '../../risks/entities/risk.entity';
import { Control } from '../../controls/entities/control.entity';

export type TaskDocument = Task & Document;

export enum TaskStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  DELAYED = 'Delayed',
}

@Schema({ timestamps: true })
export class Task {
  // 1. تفاصيل المهمة
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  // 2. المسؤول والميعاد
  @Prop({ required: true })
  assignedToEmail: string;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ type: String, enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @Prop()
  cost: number;

  // 3. الربط (Relations)
  // ده الربط الإجباري بالريسك
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Risk', required: true })
  risk: Risk;

  // ده الربط الاختياري بالكنترول
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Control' })
  relatedControl: Control;
}

export const TaskSchema = SchemaFactory.createForClass(Task);