import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity';

// Enums
import { AssetType } from '../enums/asset-type.enum';
import { DataClassification } from '../enums/data-classification.enum';
import { AssetStatus } from '../enums/asset-status.enum';

export type AssetDocument = HydratedDocument<Asset>;

// كلاس فرعي للموقع الفيزيائي (Physical Location)
@Schema()
class PhysicalLocation {
  @Prop() building: string;
  @Prop() floor: string;
  @Prop() room: string;
}

@Schema({ timestamps: true })
export class Asset {
  // --- 1. Asset Identification ---
  @Prop({ required: true, unique: true })
  assetId: string; // Auto-generate: A-2025-001

  @Prop({ required: true })
  name: string; // Asset Name

  @Prop({ type: String, enum: AssetType, required: true })
  type: AssetType; // Hardware, Software...

  @Prop()
  category: string; // e.g., OrCam

  // --- 2. Technical Details ---
  @Prop() operatingSystem: string;
  @Prop() versionModel: string;
  @Prop() manufacturer: string;
  @Prop() serialNumber: string;

  // --- 3. Classification ---
  @Prop({ type: String, enum: DataClassification, default: DataClassification.INTERNAL })
  dataClassification: DataClassification;

  @Prop({ min: 1, max: 5 })
  businessCriticality: number; // 1, 2, 3, 4, 5 (High)

  @Prop({ type: [String] })
  complianceRequirements: string[]; // [ISO-27001, GDPR]

  @Prop({ type: [String] })
  tags: string[];

  // --- 4. Ownership ---
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  owner: User; // Asset Owner

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  custodian: User; // Custodian (الشخص اللي معاه العهدة)

  @Prop({ type: PhysicalLocation })
  physicalLocation: PhysicalLocation;

  @Prop()
  networkLocation: string; // IP Address

  // --- 5. Lifecycle ---
  @Prop() acquisitionDate: Date;
  
  @Prop() warrantyExpiration: Date;
  @Prop({ default: false }) warrantyAlert: boolean; // Toggle Switch

  @Prop() endOfLifeDate: Date;
  @Prop() disposalMethod: string;

  @Prop() additionalInfo: string;

  // --- Status ---
  @Prop({ type: String, enum: AssetStatus, default: AssetStatus.DRAFT })
  status: AssetStatus;
}

export const AssetSchema = SchemaFactory.createForClass(Asset);