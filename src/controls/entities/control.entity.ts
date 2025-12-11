import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity';
// استيراد السياسات عشان الربط
import { GovernanceDocument } from '../../governance/entities/governance-document.entity';
import { ControlType } from '../enums/control-type.enum';
import { ControlStatus } from '../enums/control-status.enum';

export type ControlDocument = HydratedDocument<Control>;

// --- A. كلاس فرعي للـ Evidence (الملفات) ---
@Schema()
export class EvidenceItem {
  @Prop({ required: true }) fileName: string;
  @Prop({ required: true }) fileUrl: string; // الرابط من Cloudinary/Local
  @Prop() uploadedBy: string; // اسم الموظف
  @Prop({ default: Date.now }) uploadDate: Date;
}
const EvidenceSchema = SchemaFactory.createForClass(EvidenceItem);

// --- B. كلاس فرعي للـ KPIs (الأرقام والرسوم البيانية) ---
@Schema()
export class ControlMetric {
  @Prop() objective: string;         // "Reduce access violations"
  @Prop() target: number;            // 100 (%)
  @Prop() actual: number;            // 85 (%)
  @Prop() frequency: string;         // "Monthly"
  @Prop() lastUpdated: Date;
}
const MetricSchema = SchemaFactory.createForClass(ControlMetric);

// --- C. الكلاس الرئيسي ---
@Schema({ timestamps: true })
export class Control {
  // 1. التعريف (Identification)
  @Prop({ required: true, unique: true })
  code: string; // A.8.1.1

  @Prop({ required: true })
  name: string; // Inventory of Assets

  @Prop()
  description: string;

  // 2. العلاقة بالـ Framework (أنتي قولتي هنعمله لوحده، هنا بس بنشاور عليه)
  @Prop({ required: true, index: true })
  framework: string; // "ISO 27001" (ده الاسم اللي بنفلتر بيه في الداشبورد)

  @Prop({ default: 'General' })
  domain: string; // Access Control, Physical Security

  // 3. التصنيف والحالة
  @Prop({ type: String, enum: ControlType, default: ControlType.PREVENTIVE })
  type: ControlType;

  @Prop({ type: String, enum: ControlStatus, default: ControlStatus.NOT_STARTED })
  status: ControlStatus;

  // 4. الربط بالسياسات (Policies from Governance Module) 🔗
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'GovernanceDocument' }] })
  linkedPolicies: GovernanceDocument[]; 

  // 5. الأجزاء الفرعية (Sub-Documents)
  @Prop({ type: [EvidenceSchema], default: [] })
  evidence: EvidenceItem[]; // قائمة الملفات

  @Prop({ type: MetricSchema })
  metrics: ControlMetric;   // العدادات
}

export const ControlSchema = SchemaFactory.createForClass(Control);