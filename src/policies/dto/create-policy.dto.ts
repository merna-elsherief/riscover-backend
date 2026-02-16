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

  @ApiPropertyOptional({ type: [String], example: ['ISO27001', 'NIST'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  frameworksMapped?: string[];

  @ApiPropertyOptional({ example: 'CISO' })
  @IsOptional()
  @IsString()
  owner?: string;

  @ApiPropertyOptional({ example: 'khaled@company.com' })
  @IsOptional()
  @IsString()
  assigneeEmail?: string;

  @ApiPropertyOptional({ type: [String], example: ['user1@com.com', 'user2@com.com'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  participants?: string[];

  @ApiPropertyOptional({ example: '2025-11-11T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ example: 'v1.1' })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiPropertyOptional({ enum: PolicyStatus, example: PolicyStatus.OPEN })
  @IsOptional()
  @IsEnum(PolicyStatus)
  status?: PolicyStatus;

  @ApiPropertyOptional({ enum: PolicyPriority, example: PolicyPriority.HIGH })
  @IsOptional()
  @IsEnum(PolicyPriority)
  priority?: PolicyPriority;

  @ApiPropertyOptional({ example: 40, description: 'Progress percentage (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress?: number;

  @ApiPropertyOptional({ example: true, description: 'True for Published, False for Draft' })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({ type: [String], example: ['ISMS', 'Security'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}