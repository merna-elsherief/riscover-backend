import { IsOptional, IsString, IsEnum, IsDateString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RiskStatus } from '../enums/risk-status.enum';
import { Type } from 'class-transformer';

export class FilterRiskDto {
  // 1. فلتر الحالة (ممكن يختار Draft او Accepted...)
  @ApiProperty({ enum: RiskStatus, required: false })
  @IsOptional()
  @IsEnum(RiskStatus)
  status?: RiskStatus;

  // 2. فلتر بالمالك (يبعت الـ ID بتاع الموظف)
  @ApiProperty({ required: false, example: '65a123...' })
  @IsOptional()
  @IsString()
  ownerId?: string;

  // 3. فلتر بالتاريخ (من - إلى)
  @ApiProperty({ required: false, description: 'Format: YYYY-MM-DD' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  // 4. فلتر بالخطورة (أكبر من رقم معين)
  @ApiProperty({ required: false, example: 12 })
  @IsOptional()
  @Type(() => Number) // بيحول السترينج لرقم
  @IsNumber()
  minScore?: number;
  
  // 5. بحث بالاسم (Search Text)
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;
}