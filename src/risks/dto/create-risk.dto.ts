import { IsString, IsNotEmpty, IsInt, Min, Max, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RiskCategory } from '../enums/risk-category.enum';
import { RiskTreatment } from '../enums/risk-treatment.enum'; // 1. استيراد

export class CreateRiskDto {
  @ApiProperty({ example: 'Server Room Overheating', description: 'Risk Title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'AC units are old and failing...', description: 'Full Description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: RiskCategory, example: RiskCategory.OPERATIONAL })
  @IsOptional()
  @IsEnum(RiskCategory)
  category?: RiskCategory;

  // التواريخ الجديدة
  @ApiProperty({ example: '2023-11-01T00:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  identifiedDate?: string;

  @ApiProperty({ example: '2023-12-31T00:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ 
    enum: RiskTreatment, 
    example: RiskTreatment.MITIGATE, 
    required: false,
    description: 'Default is Mitigate if not provided' 
  })
  @IsOptional()
  @IsEnum(RiskTreatment)
  treatmentStrategy?: RiskTreatment;

  @ApiProperty({ example: 'Payment Gateway', description: 'The system or asset at risk' })
  @IsString()
  @IsNotEmpty()
  affectedSystem: string;

  // الأرقام
  @ApiProperty({ example: 4, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  likelihood: number;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  impact: number;
}