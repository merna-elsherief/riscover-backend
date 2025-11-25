import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // استيراد

export class CreateRiskDto {
  @ApiProperty({ example: 'Server Overheating', description: 'The title of the risk' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'The server room AC is failing...', description: 'Detailed description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 4, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5) // مستحيل يقبل رقم أكبر من 5
  likelihood: number;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  impact: number;
}