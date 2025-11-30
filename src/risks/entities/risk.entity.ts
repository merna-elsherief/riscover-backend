import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { Control } from '../../controls/entities/control.entity';

// Enums
import { RiskStatus } from '../enums/risk-status.enum';
import { RiskTreatment } from '../enums/risk-treatment.enum';
import { RiskCategory } from '../enums/risk-category.enum';
import { RiskPriority } from '../enums/risk-priority.enum';
import { RiskRating } from '../enums/risk-rating.enum';

export type RiskDocument = HydratedDocument<Risk>;

// --- Sub-Documents (Timeline, Tasks, Residual) ---

// 1. Timeline
@Schema()
export class RiskTimelineItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User;
  @Prop() action: string;
  @Prop() details: string;
  @Prop({ default: Date.now }) timestamp: Date;
}
const RiskTimelineSchema = SchemaFactory.createForClass(RiskTimelineItem);

// 2. Tasks (Treatment Plan Table) 🆕
@Schema()
export class RiskTask {
  @Prop({ required: true }) title: string;
  @Prop() assignee: string; // John Smith
  @Prop({ default: 'Not Started', enum: ['Not Started', 'In Progress', 'Completed'] }) 
  status: string;
  @Prop() dueDate: Date;
}
const RiskTaskSchema = SchemaFactory.createForClass(RiskTask);

// 3. Residual Risk
class ResidualRiskScore {
  @Prop() likelihood: number;
  @Prop() impact: number;
  @Prop() score: number;
  @Prop({ type: String, enum: RiskRating }) rating: RiskRating;
}

// --- Main Entity ---
@Schema({ timestamps: true })
export class Risk {
  // Identification
  @Prop({ required: true, unique: true }) siNo: string; // R-2025-001
  @Prop({ required: true }) title: string;
  @Prop() description: string;
  @Prop({ type: String, enum: RiskCategory, default: RiskCategory.OPERATIONAL }) 
  category: RiskCategory;

  // Assets & Scope
  @Prop({ type: [String], default: [] }) assetTags: string[];
  @Prop() affectedSystem: string;

  // People
  @Prop() riskOwnerEmail: string;
  @Prop() securityAnalystEmail: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' }) createdBy: User;
  @Prop() department: string;

  // Assessment (Inherent)
  @Prop({ min: 1, max: 5, required: true }) impact: number;
  @Prop({ min: 1, max: 5, required: true }) likelihood: number;
  @Prop() score: number;
  @Prop({ type: String, enum: RiskRating }) rating: RiskRating;

  // Assessment (Residual)
  @Prop({ type: ResidualRiskScore }) residualRisk: ResidualRiskScore;

  // Treatment & Priority
  @Prop({ type: String, enum: RiskPriority, default: RiskPriority.MEDIUM }) 
  priority: RiskPriority;
  
  @Prop({ type: String, enum: RiskTreatment, default: RiskTreatment.MITIGATE }) 
  treatmentStrategy: RiskTreatment;

  // Remediation (Plan + Tasks) 🆕
  @Prop() remediationPlanDescription: string; // النص الكبير
  @Prop() remediationPlanSummary: string;
  @Prop() resourcesRequired: string;
  @Prop({ default: false }) automaticReminders: boolean;
  
  @Prop({ type: [RiskTaskSchema], default: [] }) 
  tasks: RiskTask[]; // الجدول

  @Prop() dueDate: Date;

  // Linkage
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Control' }] }) 
  controls: Control[];

  @Prop({ type: [RiskTimelineSchema], default: [] }) 
  timeline: RiskTimelineItem[];

  @Prop({ type: String, enum: RiskStatus, default: RiskStatus.DRAFT }) 
  status: RiskStatus;
  
  @Prop() acceptanceJustification: string;
}

export const RiskSchema = SchemaFactory.createForClass(Risk);

// Score Calculation Logic
const calculateRating = (score: number): RiskRating => {
  if (score >= 20) return RiskRating.CRITICAL;
  if (score >= 12) return RiskRating.HIGH;
  if (score >= 6) return RiskRating.MEDIUM;
  return RiskRating.LOW;
};

RiskSchema.pre('save', function(next) {
  if (this.likelihood && this.impact) {
    this.score = this.likelihood * this.impact;
    this.rating = calculateRating(this.score);
  }
  if (this.residualRisk && this.residualRisk.likelihood && this.residualRisk.impact) {
    this.residualRisk.score = this.residualRisk.likelihood * this.residualRisk.impact;
    this.residualRisk.rating = calculateRating(this.residualRisk.score);
  }
  next();
});