import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TimelineEventType } from '../entities/policy.entity';

export class AddTimelineEventDto {
  @ApiProperty({ enum: TimelineEventType, example: TimelineEventType.COMMENT })
  @IsEnum(TimelineEventType)
  type: TimelineEventType;

  @ApiPropertyOptional({ example: 'Please review the attached ISO document.' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ example: 'ISO_Manual_2026.pdf' })
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiPropertyOptional({ example: '/uploads/policies/ISO_Manual_2026.pdf' })
  @IsOptional()
  @IsString()
  fileUrl?: string;
}