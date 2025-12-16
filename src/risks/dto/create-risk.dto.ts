import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, IsEmail, IsNotEmpty, IsNumber, Min, Max, 
  IsOptional, IsBoolean, IsDateString, IsEnum, IsArray, 
  ValidateNested 
} from 'class-validator';
import { Type } from 'class-transformer';

// ------------------------------------------
// 1. Task DTO
// ------------------------------------------
export class CreateRiskTaskDto {
  @ApiProperty({ example: 'Update Firewall Rules' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'admin@company.com' })
  @IsEmail()
  @IsNotEmpty()
  assigneeEmail: string;

  @ApiProperty({ example: '2025-10-01' })
  @IsDateString()
  @IsNotEmpty()
  dueDate: string;
}

// ------------------------------------------
// Enums
// ------------------------------------------
export enum RiskStatus {
  DRAFT = 'Draft',
  IN_PROGRESS = 'In Progress',
  CLOSED = 'Closed',
}

export enum TreatmentOption {
  ACCEPT = 'Accept',
  MITIGATE = 'Mitigate',
  AVOID = 'Avoid',
}

// ------------------------------------------
// 2. Main DTO (CreateRiskDto)
// ------------------------------------------
export class CreateRiskDto {
  @ApiProperty({ example: 'Database Failure' })
  @IsString()
  @IsNotEmpty()
  riskName: string;

  @ApiPropertyOptional({ example: 'Detailed description...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'Technical' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiPropertyOptional({ example: 'Core Banking System' })
  @IsString()
  @IsOptional()
  impactedSystem?: string;

  @ApiPropertyOptional({ example: 'High', enum: ['Critical', 'High', 'Medium', 'Low'] })
  @IsString()
  @IsOptional()
  priority?: string;

  @ApiPropertyOptional({ example: ['Server 1', 'DB 2'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  assetTags?: string[];

  @ApiProperty({ example: 'owner@company.com' })
  @IsEmail()
  @IsNotEmpty()
  riskOwnerEmail: string;

  @ApiProperty({ example: 'analyst@company.com' })
  @IsEmail()
  @IsNotEmpty()
  securityAnalystEmail: string;

  @ApiPropertyOptional({ example: 'Firewall' })
  @IsString()
  @IsOptional()
  existingControl?: string;

  // ✅ Inherent Risk Scores (قبل المعالجة)
  @ApiProperty({ example: 4 })
  @IsNumber()
  @Min(1) @Max(5)
  impactScore: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(1) @Max(5)
  likelihoodScore: number;

  // ✅✅✅ Residual Risk Scores (الجديد: بعد المعالجة) ✅✅✅
  // خليناها Optional عشان ممكن متتحطش وقت الإنشاء
  @ApiPropertyOptional({ example: 2, description: 'Impact score after mitigation' })
  @IsNumber()
  @Min(1) @Max(5)
  @IsOptional()
  residualImpactScore?: number;

  @ApiPropertyOptional({ example: 1, description: 'Likelihood score after mitigation' })
  @IsNumber()
  @Min(1) @Max(5)
  @IsOptional()
  residualLikelihoodScore?: number;

  @ApiProperty({ example: 'Mitigate', enum: TreatmentOption })
  @IsEnum(TreatmentOption)
  @IsNotEmpty()
  treatmentOption: string;

  @ApiPropertyOptional({ example: 'We will upgrade the servers...' })
  @IsString()
  @IsOptional()
  remediationPlan?: string;

  @ApiPropertyOptional({ type: [CreateRiskTaskDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRiskTaskDto)
  @IsOptional()
  mitigationTasks?: CreateRiskTaskDto[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  resourcesRequired?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  autoReminders?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  remediationPlanSummary?: string;

  @ApiProperty({ example: '2025-12-01' })
  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @ApiPropertyOptional({ 
    enum: RiskStatus, 
    default: RiskStatus.DRAFT,
    description: 'Status of the risk (defaults to Draft)'
  })
  @IsEnum(RiskStatus)
  @IsOptional()
  status?: RiskStatus = RiskStatus.DRAFT;
}