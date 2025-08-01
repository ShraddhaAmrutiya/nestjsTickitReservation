import {
  Injectable,
  BadRequestException,
  // InternalServerErrorException,
  NotFoundException,
  Inject,
  // ConflictException,
} from '@nestjs/common';

import {
  BookingDto,
  //  UpdateBookingDto
} from './DTO/addbooking.dto';
import { Model } from 'mongoose';
// import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { booking } from './booking.schema';
import { Schedule } from '../schedule/schedule.schema';
import { bus } from '../bus/bus.schema';
import { User } from '../user/User.schema';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(bus.name) private busModel: Model<bus>,
    @InjectModel(booking.name) private bookingModel: Model<booking>,
    @Inject('MAIL_SERVICE') private mailClient: ClientProxy,
  ) {}
  async create(bookingDto: BookingDto): Promise<any> {
    const { scheduleId, seatNumber } = bookingDto;

    const schedule = await this.scheduleModel.findById(scheduleId);
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    const bus = await this.busModel.findById(schedule.busId);
    if (!bus) {
      throw new NotFoundException('Bus not found for this schedule');
    }

    const seat = bus.seats.find((s) => s.seatNumber === seatNumber);
    if (!seat) {
      throw new BadRequestException('Seat not found');
    }
    if (!seat.available) {
      throw new BadRequestException('Seat already booked');
    }

    seat.available = false;
    bus.availabeSeats = (bus.availabeSeats || 0) - 1;
    await bus.save();

    const bookingDoc = new this.bookingModel(bookingDto);
    const savedBooking = await bookingDoc.save();

    const user = await this.userModel.findById(bookingDto.userId);
    if (!user || !user.email) {
      console.warn('User email not found, skipping mail sending.');
    } else {
      await lastValueFrom(
        this.mailClient.emit('booking_mail_queue', {
          email: user.email,
          name: user.userName,
          seatNumber,
          busName: bus.busName,
          busNumber: bus.busNumber,
          bookingDate: bookingDto.bookingDate,
        }),
      );
    }

    return savedBooking;
  }
}
