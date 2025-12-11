import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFrameworkDto {
  @ApiProperty({ example: 'ISO 27001' })
  @IsString() @IsNotEmpty()
  name: string;

  @ApiProperty() @IsString() @IsOptional()
  description?: string;

  @ApiProperty() @IsString() @IsOptional()
  type?: string;

  @ApiProperty() @IsString() @IsOptional()
  version?: string;
}