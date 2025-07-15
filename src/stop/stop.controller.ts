import {
  Controller,
  Body,
  Get,
  Post,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { StopService } from './stop.service';
import { StopDto, UpdateStopDto } from './dto/stop.dto';
import { ApiBody } from '@nestjs/swagger';
@Controller('stop')
export class StopController {
  constructor(private readonly stopService: StopService) {}

  @Post('/create')
  create(@Body() stop: StopDto) {
    return this.stopService.create(stop);
  }
  @Get('/all')
  findAll() {
    return this.stopService.findAll();
  }
  @Get(':id')
  FindOne(@Param('id') id: string) {
    return this.stopService.FindOne(id);
  }
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.stopService.delete(id);
  }
  @Patch(':id')
  @ApiBody({ type: UpdateStopDto })
  update(@Param('id') id: string, @Body() stop: Partial<StopDto>) {
    return this.stopService.update(id, stop);
  }
}
