import { IsString, IsNotEmpty, IsEnum, IsOptional, IsMongoId, IsDateString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '../enums/document-type.enum';
import { DocumentStatus } from '../enums/document-status.enum';

export class CreateGovernanceDocumentDto {
  @ApiProperty({ example: 'ISP-01' })
  @IsString() @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Information Security Policy' })
  @IsString() @IsNotEmpty()
  title: string;

  @ApiProperty() @IsString() @IsOptional()
  description?: string;

  @ApiProperty({ enum: DocumentType })
  @IsEnum(DocumentType)
  type: DocumentType;

  @ApiProperty({ description: 'User ID of the owner' })
  @IsMongoId()
  owner: string;

  @ApiProperty({ example: 'CISO', description: 'Job title at time of creation' })
  @IsString() @IsOptional()
  ownerJobTitle?: string;

  @ApiProperty({ example: 'v1.0' })
  @IsString() @IsOptional()
  version?: string;

  @ApiProperty({ example: '2025-12-01' })
  @IsDateString()
  nextReviewDate: string;

  @ApiProperty({ description: 'URL from /common/upload endpoint' })
  @IsString() @IsNotEmpty() // لازم يكون فيه ملف
  fileUrl: string;

  @ApiProperty() @IsArray() @IsString({ each: true }) @IsOptional()
  mappedFrameworks?: string[];

  @ApiProperty({ enum: DocumentStatus })
  @IsEnum(DocumentStatus) @IsOptional()
  status?: DocumentStatus;
}