import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BookingDto, UpdateBookingStatusDto } from './DTO/addbooking.dto';
import { BookingService } from './booking.service';
// import { BookingStatus } from './booking.schema';

@ApiTags('booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/create')
  create(@Body() booking: BookingDto) {
    return this.bookingService.create(booking);
  }

  @Get(':userId')
  getUserBookings(@Param('userId') userId: string) {
    return this.bookingService.getUserBookings(userId);
  }

  @Post('/update-status')
  updateBookingStatus(@Body() body: UpdateBookingStatusDto) {
    return this.bookingService.updatebookingStatus(
      body.userBookingId,
      body.bookingId,
      body.status,
    );
  }
}
