import {
  Controller,
  Body,
  Param,
  Post,
  Patch,
  Get,
  Delete,
} from '@nestjs/common';
import { RoutesService } from './routes.service';
import { Routdto, updateBusRoute } from './DTO/busroute.dto';
import { ApiBody } from '@nestjs/swagger';
@Controller('routes')
export class RoutesController {
  constructor(private readonly routService: RoutesService) {}
  @Post('/create')
  create(@Body() rout: Routdto) {
    return this.routService.create(rout);
  }
  @Get('/all')
  findAll() {
    return this.routService.findAll();
  }
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.routService.findOne(id);
  }
  @Delete('/delete/:id')
  delete(@Param('id') id: string) {
    return this.routService.delete(id);
  }
  @Patch('/update/:id')
  @ApiBody({ type: updateBusRoute })
  update(@Param('id') id: string, @Body() rout: Partial<Routdto>) {
    return this.routService.update(id, rout);
  }
}
