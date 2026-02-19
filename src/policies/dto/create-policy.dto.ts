import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, IsEnum, IsOptional, IsArray, 
  IsDateString, IsNumber, Min, Max, IsBoolean 
} from 'class-validator';
import { DocumentType, PolicyStatus, PolicyPriority } from '../entities/policy.entity';

export class CreatePolicyDto {
  @ApiProperty({ example: 'Information Security Manual' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'The purpose of this manual is to specify...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: DocumentType, example: DocumentType.POLICY })
  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType;

  @ApiPropertyOptional({ example: 'Khaled Alaa' })
  @IsOptional()
  @IsString()
  assigneeName?: string;

  @ApiPropertyOptional({ example: 'khaled@company.com' })
  @IsOptional()
  @IsString()
  assigneeEmail?: string;

  @ApiPropertyOptional({ example: '2026-11-11T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ enum: PolicyStatus, example: PolicyStatus.SUBMIT_FOR_REVIEW })
  @IsOptional()
  @IsEnum(PolicyStatus)
  status?: PolicyStatus;

  @ApiPropertyOptional({ enum: PolicyPriority })
  @IsOptional()
  @IsEnum(PolicyPriority)
  priority?: PolicyPriority;

  @ApiPropertyOptional({ example: 0, description: 'Progress percentage (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({ type: [String], example: ['ISMS'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ type: [String], example: ['user1@com.com'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  participants?: string[];
}