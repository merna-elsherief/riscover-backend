import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ControlType } from '../enums/control-type.enum'; // استيراد الـ Enum

export type ControlDocument = HydratedDocument<Control>;

@Schema({ timestamps: true })
export class Control {
  @Prop({ required: true, unique: true })
  code: string; // مثال: NIST-AC-1

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ 
    required: true,
    type: String,
    enum: ControlType,
    default: ControlType.PREVENTIVE 
  })
  type: ControlType;

  @Prop({ default: true })
  isActive: boolean;
}

export const ControlSchema = SchemaFactory.createForClass(Control);