import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FrameworkDocument = HydratedDocument<Framework>;

@Schema({ timestamps: true })
export class Framework {
  @Prop({ required: true, unique: true })
  name: string; // ISO 27001, SOC2, GDPR

  @Prop()
  description: string;

  @Prop({ default: 'Security' }) 
  type: string; // Security, Privacy, Quality

  @Prop()
  version: string; // 2013, 2022

  @Prop()
  issuingBody: string; // ISO Org, PCI Council
}

export const FrameworkSchema = SchemaFactory.createForClass(Framework);