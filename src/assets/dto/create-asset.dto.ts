import { IsString, IsNotEmpty, IsEnum, IsOptional, IsInt, Min, Max, IsArray, IsBoolean, IsDateString, ValidateNested, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { AssetType } from '../enums/asset-type.enum';
import { DataClassification } from '../enums/data-classification.enum';
import { AssetStatus } from '../enums/asset-status.enum';

class PhysicalLocationDto {
  @ApiProperty() @IsOptional() @IsString() building: string;
  @ApiProperty() @IsOptional() @IsString() floor: string;
  @ApiProperty() @IsOptional() @IsString() room: string;
}

export class CreateAssetDto {
  @ApiProperty({ example: 'Main Database Server' })
  @IsString() @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: AssetType })
  @IsEnum(AssetType)
  type: AssetType;

  @ApiProperty() @IsOptional() @IsString() category: string;

  // Technical
  @ApiProperty() @IsOptional() @IsString() operatingSystem: string;
  @ApiProperty() @IsOptional() @IsString() versionModel: string;
  @ApiProperty() @IsOptional() @IsString() manufacturer: string;
  @ApiProperty() @IsOptional() @IsString() serialNumber: string;

  // Classification
  @ApiProperty({ enum: DataClassification })
  @IsOptional() @IsEnum(DataClassification)
  dataClassification?: DataClassification;

  @ApiProperty({ example: 4 })
  @IsOptional() @IsInt() @Min(1) @Max(5)
  businessCriticality?: number;

  @ApiProperty() @IsOptional() @IsArray() @IsString({ each: true })
  complianceRequirements?: string[];

  @ApiProperty() @IsOptional() @IsArray() @IsString({ each: true })
  tags?: string[];

  // Ownership (User IDs)
  @ApiProperty({ example: '65a...' }) @IsOptional() @IsMongoId()
  owner?: string;

  @ApiProperty({ example: '65b...' }) @IsOptional() @IsMongoId()
  custodian?: string;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => PhysicalLocationDto)
  physicalLocation?: PhysicalLocationDto;

  @ApiProperty() @IsOptional() @IsString() networkLocation: string;

  // Lifecycle
  @ApiProperty() @IsOptional() @IsDateString() acquisitionDate?: string;
  @ApiProperty() @IsOptional() @IsDateString() warrantyExpiration?: string;
  @ApiProperty() @IsOptional() @IsBoolean() warrantyAlert?: boolean;
  @ApiProperty() @IsOptional() @IsDateString() endOfLifeDate?: string;
  @ApiProperty() @IsOptional() @IsString() disposalMethod?: string;
  @ApiProperty() @IsOptional() @IsString() additionalInfo?: string;

  // Status (Draft/Active)
  @ApiProperty({ enum: AssetStatus }) 
  @IsOptional() @IsEnum(AssetStatus) 
  status?: AssetStatus;
}