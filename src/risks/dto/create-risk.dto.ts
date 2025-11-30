import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max, IsArray, IsEnum, IsEmail, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// استيراد الـ Enums
import { RiskCategory } from '../enums/risk-category.enum';
import { RiskPriority } from '../enums/risk-priority.enum';
import { RiskTreatment } from '../enums/risk-treatment.enum';

export class CreateRiskDto {
  // Risk Identification
  @ApiProperty({ example: 'Phishing Attack' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Description of the risk...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: RiskCategory })
  @IsEnum(RiskCategory)
  category: RiskCategory;

  // Assets
  @ApiProperty({ example: ['Server', 'Database'], isArray: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assetTags?: string[];

  @ApiProperty({ example: 'ERP System' })
  @IsString()
  @IsNotEmpty()
  affectedSystem: string;

  // People (Emails) 📧
  @ApiProperty({ example: 'owner@company.com' })
  @IsEmail()
  @IsNotEmpty()
  riskOwnerEmail: string;

  @ApiProperty({ example: 'analyst@company.com' })
  @IsEmail()
  @IsNotEmpty()
  securityAnalystEmail: string;

  // Scoring
  @ApiProperty({ example: 4, minimum: 1, maximum: 5 })
  @IsInt() @Min(1) @Max(5)
  impact: number;

  @ApiProperty({ example: 3, minimum: 1, maximum: 5 })
  @IsInt() @Min(1) @Max(5)
  likelihood: number;

  // Priority & Treatment
  @ApiProperty({ enum: RiskPriority })
  @IsOptional()
  @IsEnum(RiskPriority)
  priority?: RiskPriority;

  @ApiProperty({ enum: RiskTreatment })
  @IsOptional()
  @IsEnum(RiskTreatment)
  treatmentStrategy?: RiskTreatment;

  // Remediation
  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  remediationPlan?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  remediationPlanSummary?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  resourcesRequired?: string;

  @ApiProperty({ example: true })
  @IsOptional() @IsBoolean()
  automaticReminders?: boolean;

  @ApiProperty({ required: false })
  @IsOptional() @IsDateString()
  dueDate?: string;
}