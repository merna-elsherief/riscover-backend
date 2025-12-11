import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ControlsService } from './controls.service';
import { CreateControlDto } from './dto/create-control.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Controls')
@Controller('controls')
export class ControlsController {
  constructor(private readonly controlsService: ControlsService) {}

  @Post()
  create(@Body() createDto: CreateControlDto) {
    return this.controlsService.create(createDto);
  }

  @Get()
  findAll() { return this.controlsService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.controlsService.findOne(id); }

  // Endpoint خاصة لإضافة Evidence
  @Post(':id/evidence')
  @ApiOperation({ summary: 'Link an uploaded file as evidence' })
  addEvidence(
    @Param('id') id: string, 
    @Body() body: { fileName: string, fileUrl: string, uploadedBy: string }
  ) {
    return this.controlsService.addEvidence(id, body);
  }
}