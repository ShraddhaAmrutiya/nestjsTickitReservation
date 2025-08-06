import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ScheduleSeatService } from './schedule-seat.service';
import { CreateScheduleSeatDto } from './dto/create-schedule-seat.dto';
import { UpdateScheduleSeatDto } from './dto/update-schedule-seat.dto';

@Controller('schedule-seat')
export class ScheduleSeatController {
  constructor(private readonly service: ScheduleSeatService) {}

  @Post()
  create(@Body() dto: CreateScheduleSeatDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('schedule/:scheduleId')
  findBySchedule(@Param('scheduleId') scheduleId: string) {
    return this.service.findBySchedule(scheduleId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateScheduleSeatDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
