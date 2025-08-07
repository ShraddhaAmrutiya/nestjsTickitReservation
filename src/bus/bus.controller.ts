import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  // Patch,
} from '@nestjs/common';
import { BusService } from './bus.service';
import { createBusDto /*, UpdateBusDto */ } from './DTO/bus.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { BusSummary } from './DTO/bus.dto';
// import { ApiBody } from '@nestjs/swagger';
@Controller('bus')
export class BusController {
  constructor(private readonly busService: BusService) {}
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/create')
  create(@Body() bus: createBusDto) {
    return this.busService.create(bus);
  }
  @Get('/all')
  findAll(): Promise<BusSummary[]> {
    return this.busService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.busService.findOne(id);
  }
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.busService.delete(id);
  }
  // @Patch(':id')
  // @ApiBody({ type: UpdateBusDto })
  // update(@Param('id') id: string, @Body() bus: UpdateBusDto) {
  //   return this.busService.update(id, bus);
  // }
}
