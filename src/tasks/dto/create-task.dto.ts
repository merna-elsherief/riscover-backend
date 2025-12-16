import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsDateString, IsEnum, IsNumber, IsMongoId, IsOptional } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @ApiProperty({ example: 'Update Firewall Rules' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Block port 8080' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'admin@company.com' })
  @IsEmail()
  @IsNotEmpty()
  assignedToEmail: string;

  @ApiProperty({ example: '2025-06-30' })
  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.PENDING })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({ example: 1000 })
  @IsNumber()
  @IsOptional()
  cost?: number;

  // هنا بنستقبل الـ ID بس
  @ApiProperty({ example: '64f8a5c2e4b0...' })
  @IsMongoId()
  @IsNotEmpty()
  riskId: string;

  @ApiPropertyOptional({ example: '64f8a5c2e4b0...' })
  @IsMongoId()
  @IsOptional()
  relatedControlId?: string;
}