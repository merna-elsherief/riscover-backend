import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'; // ✅ استيراد
import { RisksService } from './risks.service';
import { CreateRiskDto } from './dto/create-risk.dto';
import { UpdateRiskDto } from './dto/update-risk.dto';

@ApiTags('risks') // ✅ يجمعهم تحت عنوان واحد
@Controller('risks')
export class RisksController {
  constructor(private readonly risksService: RisksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new risk' }) // ✅ وصف للعملية
  @ApiResponse({ status: 201, description: 'The risk has been successfully created.' })
  create(@Body() createRiskDto: CreateRiskDto) {
    return this.risksService.create(createRiskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all risks' })
  findAll() {
    return this.risksService.findAll();
  }

  @Get('next-id')
  @ApiOperation({ summary: 'Get the next auto-generated ID' })
  getNextId() {
    return this.risksService.getNextIdForDisplay();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific risk by ID' })
  findOne(@Param('id') id: string) {
    return this.risksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a risk' })
  update(@Param('id') id: string, @Body() updateRiskDto: UpdateRiskDto) {
    return this.risksService.update(id, updateRiskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a risk' })
  remove(@Param('id') id: string) {
    return this.risksService.remove(id);
  }
}