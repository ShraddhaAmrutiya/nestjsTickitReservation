import {
  Body,
  Controller,
  Post,
  //   Get,
  //   Param,
  //   Delete,
  //   Patch,
} from '@nestjs/common';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BookingDto } from './DTO/addbooking.dto';
import { BookingService } from './booking.service';
@ApiTags('booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/create')
  create(@Body() booking: BookingDto) {
    return this.bookingService.create(booking);
  }
}
