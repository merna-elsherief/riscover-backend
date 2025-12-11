import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { DocumentType } from '../enums/document-type.enum';
import { DocumentStatus } from '../enums/document-status.enum';

export type GovernanceDocumentDocument = HydratedDocument<GovernanceDocument>;

@Schema({ timestamps: true })
export class GovernanceDocument {
  // 1. Identification
  @Prop({ required: true, unique: true })
  code: string; // e.g., "ISP-01"

  @Prop({ required: true })
  title: string; // e.g., "Information Security Policy"

  @Prop()
  description: string;

  // 2. Sidebar Classification
  @Prop({ 
    type: String, 
    enum: DocumentType, 
    default: DocumentType.POLICY,
    index: true // عشان الفلترة تكون سريعة
  })
  type: DocumentType;

  // 3. Ownership
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  owner: User; // مين الشخص (عشان الـ ID)

  @Prop()
  ownerJobTitle: string; // "CISO" (عشان العرض في الجدول)

  // 4. Versioning & Lifecycle
  @Prop({ default: 'v1.0' })
  version: string;

  @Prop({ required: true })
  nextReviewDate: Date; // تاريخ المراجعة القادم

  @Prop()
  lastReviewDate: Date;

  // 5. The File (Upload)
  @Prop()
  fileUrl: string; // الرابط اللي راجع من Cloudinary

  // 6. Mapping (Related Standards)
  @Prop({ type: [String], default: [] })
  mappedFrameworks: string[]; // ["ISO 27001", "PCI DSS"]

  // 7. Status
  @Prop({ type: String, enum: DocumentStatus, default: DocumentStatus.DRAFT })
  status: DocumentStatus;
}

export const GovernanceDocumentSchema = SchemaFactory.createForClass(GovernanceDocument);