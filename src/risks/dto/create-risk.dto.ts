import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsNumber, Min, Max, IsOptional, IsBoolean, IsDateString, IsEnum, IsArray } from 'class-validator';

// ✅ دول الناقصين اللي بيطلعوا الايرور في الـ Seed
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

export class CreateRiskDto {
  @ApiProperty({ example: 'Database Failure' })
  @IsString()
  @IsNotEmpty()
  riskName: string;

  @ApiPropertyOptional({ example: 'Detailed description of the risk...' })
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

  @ApiProperty({ example: 4 })
  @IsNumber()
  @Min(1) @Max(5)
  impactScore: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(1) @Max(5)
  likelihoodScore: number;

  // لاحظي هنا بنستخدم الـ Enum اللي عرفناه فوق
  @ApiProperty({ example: 'Mitigate', enum: TreatmentOption })
  @IsEnum(TreatmentOption) // أو خليها IsString لو عايزه تبعتي نص حر
  @IsNotEmpty()
  treatmentOption: string; // خليناها string عشان تقبل النص اللي جي من الـ Enum

  @ApiPropertyOptional({ example: 'We will upgrade the servers...' })
  @IsString()
  @IsOptional()
  remediationPlan?: string;

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

  @ApiPropertyOptional({ enum: RiskStatus, default: RiskStatus.DRAFT })
  @IsEnum(RiskStatus)
  @IsOptional()
  status?: RiskStatus = RiskStatus.DRAFT;
}