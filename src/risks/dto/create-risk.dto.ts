import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max, IsArray, IsEnum, IsEmail, IsBoolean, IsDateString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer'; // ⚠️ مهم

import { RiskCategory } from '../enums/risk-category.enum';
import { RiskPriority } from '../enums/risk-priority.enum';
import { RiskTreatment } from '../enums/risk-treatment.enum';

// DTO فرعي للمهام
class CreateTaskDto {
  @ApiProperty({ example: 'Automate journal entry validation' })
  @IsString() @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'John Smith' })
  @IsString() @IsNotEmpty()
  assignee: string;

  @ApiProperty({ example: '2025-10-15' })
  @IsDateString()
  dueDate: string;
}

export class CreateRiskDto {
  // Basic Info
  @ApiProperty({ example: 'Financial Reporting Errors' })
  @IsString() @IsNotEmpty() title: string;

  @ApiProperty({ example: 'Risk of misstatements due to manual entries...' })
  @IsString() @IsNotEmpty() description: string;

  @ApiProperty({ enum: RiskCategory })
  @IsEnum(RiskCategory) category: RiskCategory;

  // Assets
  @ApiProperty({ example: ['SQL Server', 'General Ledger'], isArray: true })
  @IsOptional() @IsArray() @IsString({ each: true })
  assetTags?: string[];

  @ApiProperty({ example: 'Finance System' })
  @IsString() @IsNotEmpty() affectedSystem: string;

  // Emails
  @ApiProperty() @IsEmail() riskOwnerEmail: string;
  @ApiProperty() @IsEmail() securityAnalystEmail: string;

  // Scoring
  @ApiProperty({ example: 4 }) @IsInt() @Min(1) @Max(5) impact: number;
  @ApiProperty({ example: 3 }) @IsInt() @Min(1) @Max(5) likelihood: number;

  // Treatment & Plan
  @ApiProperty({ enum: RiskPriority })
  @IsOptional() @IsEnum(RiskPriority) priority?: RiskPriority;

  @ApiProperty({ enum: RiskTreatment })
  @IsOptional() @IsEnum(RiskTreatment) treatmentStrategy?: RiskTreatment;

  @ApiProperty() @IsOptional() @IsString() remediationPlanDescription?: string;
  @ApiProperty() @IsOptional() @IsString() remediationPlanSummary?: string;
  @ApiProperty() @IsOptional() @IsString() resourcesRequired?: string;
  @ApiProperty() @IsOptional() @IsBoolean() automaticReminders?: boolean;
  @ApiProperty() @IsOptional() @IsDateString() dueDate?: string;

  // Tasks Array 🆕
  @ApiProperty({ type: [CreateTaskDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskDto)
  tasks?: CreateTaskDto[];
}