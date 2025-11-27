import { Injectable } from '@nestjs/common';
import { CreateControlDto } from './dto/create-control.dto';
import { UpdateControlDto } from './dto/update-control.dto';

@Injectable()
export class ControlsService {
  create(createControlDto: CreateControlDto) {
    return 'This action adds a new control';
  }

  findAll() {
    return `This action returns all controls`;
  }

  findOne(id: number) {
    return `This action returns a #${id} control`;
  }

  update(id: number, updateControlDto: UpdateControlDto) {
    return `This action updates a #${id} control`;
  }

  remove(id: number) {
    return `This action removes a #${id} control`;
  }
}
