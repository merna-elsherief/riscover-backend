import { IsString, IsNotEmpty, IsEnum, IsOptional, IsInt, Min, Max, IsArray, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RiskCategory, RiskStrategy, RiskStatus } from '../enums/risk-enums';

export class CreateRiskDto {
  @ApiProperty()
  @IsString() @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString() @IsOptional()
  description?: string;

  @ApiProperty({ enum: RiskCategory })
  @IsEnum(RiskCategory)
  category: RiskCategory;

  // Linkage
  @ApiProperty({ type: [String] })
  @IsArray() @IsMongoId({ each: true }) @IsOptional()
  affectedAssets?: string[];

  @ApiProperty() @IsMongoId() @IsOptional()
  owner?: string;

  // Inherent Assessment (1-5)
  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsInt() @Min(1) @Max(5)
  inherentLikelihood: number;

  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsInt() @Min(1) @Max(5)
  inherentImpact: number;

  // Treatment
  @ApiProperty({ enum: RiskStrategy })
  @IsEnum(RiskStrategy) @IsOptional()
  treatmentStrategy?: RiskStrategy;

  @ApiProperty({ type: [String] })
  @IsArray() @IsMongoId({ each: true }) @IsOptional()
  mitigatingControls?: string[];

  // Residual inputs (Optional at creation)
  @ApiProperty({ required: false })
  @IsInt() @Min(1) @Max(5) @IsOptional()
  residualLikelihood?: number;

  @ApiProperty({ required: false })
  @IsInt() @Min(1) @Max(5) @IsOptional()
  residualImpact?: number;
}