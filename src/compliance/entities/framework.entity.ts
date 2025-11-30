import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FrameworkDocument = HydratedDocument<Framework>;

@Schema({ timestamps: true })
export class Framework {
  @Prop({ required: true, unique: true }) name: string; // ISO 27001
  @Prop() description: string;
  @Prop({ default: 'Security' }) type: string;
}

export const FrameworkSchema = SchemaFactory.createForClass(Framework);