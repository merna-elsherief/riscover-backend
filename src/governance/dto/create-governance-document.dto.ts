import { IsString, IsNotEmpty, IsEnum, IsOptional, IsMongoId, IsDateString, IsArray, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '../enums/document-type.enum';
import { DocumentStatus } from '../enums/document-status.enum';
import { Priority } from '../enums/priority.enum';

export class CreateGovernanceDocumentDto {
  // ... (القديم: code, title, fileUrl)
  @ApiProperty() @IsString() @IsNotEmpty() code: string;
  @ApiProperty() @IsString() @IsNotEmpty() title: string;
  @ApiProperty() @IsString() @IsOptional() fileUrl?: string;
  @ApiProperty({ enum: DocumentType }) @IsEnum(DocumentType) type: DocumentType;
  @ApiProperty() @IsMongoId() owner: string;

  // --- 🆕 الجديد ---
  @ApiProperty({ enum: Priority }) 
  @IsEnum(Priority) @IsOptional() 
  priority?: Priority;

  @ApiProperty() @IsMongoId() @IsOptional() 
  assignee?: string;

  @ApiProperty() @IsArray() @IsMongoId({ each: true }) @IsOptional()
  participants?: string[];

  @ApiProperty() @IsDateString() @IsOptional() 
  dueDate?: string;

  @ApiProperty() @IsNumber() @Min(0) @Max(100) @IsOptional()
  progress?: number;

  @ApiProperty() @IsArray() @IsString({ each: true }) @IsOptional()
  tags?: string[];
}