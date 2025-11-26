import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ControlsService } from './controls.service';
import { CreateControlDto } from './dto/create-control.dto';
import { UpdateControlDto } from './dto/update-control.dto';

@Controller('controls')
export class ControlsController {
  constructor(private readonly controlsService: ControlsService) {}

  @Post()
  create(@Body() createControlDto: CreateControlDto) {
    return this.controlsService.create(createControlDto);
  }

  @Get()
  findAll() {
    return this.controlsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.controlsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateControlDto: UpdateControlDto) {
    return this.controlsService.update(+id, updateControlDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.controlsService.remove(+id);
  }
}
