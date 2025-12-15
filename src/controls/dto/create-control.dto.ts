import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray, IsNumber, ValidateNested, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ControlType } from '../enums/control-type.enum';
import { ControlStatus } from '../enums/control-status.enum';

// DTO للـ Metrics
class CreateMetricDto {
  @ApiProperty() @IsString() objective: string;
  @ApiProperty() @IsNumber() target: number;
  @ApiProperty() @IsNumber() actual: number;
  @ApiProperty() @IsString() frequency: string;
}

export class CreateControlDto {
  @ApiProperty({ example: 'A.8.1.1' })
  @IsString() @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Inventory of Assets' })
  @IsString() @IsNotEmpty()
  name: string;

  @ApiProperty() @IsString() @IsOptional()
  description?: string;

  @ApiProperty({ example: 'ISO 27001' })
  @IsString() @IsNotEmpty()
  framework: string;

  @ApiProperty({ enum: ControlStatus })
  @IsEnum(ControlStatus) @IsOptional()
  status?: ControlStatus;

  @ApiProperty({ enum: ControlType })
  @IsEnum(ControlType) @IsOptional()
  type?: ControlType;

  // 🔗 الربط بالسياسات (بناخد الـ IDs بس)
  @ApiProperty({ example: ['65a...'], description: 'Array of Policy IDs' })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  linkedPolicies?: string[];

  // 📊 المقاييس
  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateMetricDto)
  metrics?: CreateMetricDto;
}