import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ControlsService } from './controls.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Controls')
@Controller('controls')
export class ControlsController {
  constructor(private readonly controlsService: ControlsService) {}

  @Post()
  create(@Body() createDto: any) {
    return this.controlsService.create(createDto);
  }

  @Get()
  findAll() { return this.controlsService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.controlsService.findOne(id); }
}