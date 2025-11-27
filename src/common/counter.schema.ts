import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CounterDocument = HydratedDocument<Counter>;

@Schema()
export class Counter {
  @Prop({ required: true, unique: true })
  name: string; // اسم العداد (مثلاً: "risks")

  @Prop({ default: 0 })
  seq: number; // الرقم الحالي
}

export const CounterSchema = SchemaFactory.createForClass(Counter);