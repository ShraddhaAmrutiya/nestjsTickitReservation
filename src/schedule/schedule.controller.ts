import {
  Controller,
  Body,
  Param,
  Post,
  Patch,
  Get,
  Delete,
} from '@nestjs/common';
// import { ApiBody } from '@nestjs/swagger';
import { ScheduleService } from './schedule.service';
import { ScheduleDto, UpdateScheduleDto } from './DTO/schedule.dto';
import { ApiBody } from '@nestjs/swagger';
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}
  @Post('/create')
  create(@Body() schedule: ScheduleDto) {
    return this.scheduleService.create(schedule);
  }
  @Get('/all')
  findAll() {
    return this.scheduleService.findAll();
  }
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(id);
  }
  @Delete('delete/:id')
  Delete(@Param('id') id: string) {
    return this.scheduleService.delete(id);
  }
  @Patch('update/:id')
  @ApiBody({ type: UpdateScheduleDto })
  update(@Param('id') id: string, @Body() schedule: Partial<ScheduleDto>) {
    return this.scheduleService.update(id, schedule);
  }
}
