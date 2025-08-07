import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { BookingDto } from './DTO/addbooking.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BookingGroup, BookingStatus } from './booking.schema';
import { Schedule } from '../schedule/schedule.schema';
import { bus } from '../bus/bus.schema';
import { User } from '../user/User.schema';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { ScheduleSeat } from 'src/schedule-seat/schedule-seat.schema';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel('Schedule') private scheduleModel: Model<Schedule>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('bus') private busModel: Model<bus>,
    @InjectModel('ScheduleSeat') private ScheduleSeatModel: Model<ScheduleSeat>,
    @InjectModel('booking') private bookingModel: Model<BookingGroup>,
    @Inject('MAIL_SERVICE') private mailClient: ClientProxy,
  ) {}

  async create(bookingDto: BookingDto): Promise<any> {
    const { scheduleId, seatNumber, userId } = bookingDto;

    try {
      const schedule = await this.scheduleModel.findById(scheduleId);
      if (!schedule) throw new NotFoundException('Schedule not found');

      const bus = await this.busModel.findById(schedule.busId);
      if (!bus) throw new NotFoundException('Bus not found');

      const scheduleSeat = await this.ScheduleSeatModel.findOne({
        scheduleId: scheduleId,
      });

      if (!scheduleSeat) throw new NotFoundException('ScheduleSeat not found');

      const seat = scheduleSeat.seats.find((s) => s.seatNumber === seatNumber);
      if (!seat) throw new BadRequestException('Seat not found');
      if (!seat.available) throw new BadRequestException('Seat already booked');

      // Reserve seat
      seat.available = false;
      seat.userId = userId;
      scheduleSeat.availableSeats -= 1;
      await scheduleSeat.save();

      // Create booking item
      const bookingItem = {
        scheduleId: new Types.ObjectId(scheduleId),
        seatNumber,
        bookingDate: new Date(),
        status: BookingStatus.BOOKED,
      };

      // Create or update booking group
      const objectUserId = new Types.ObjectId(userId);
      let userBooking = await this.bookingModel.findOne({
        userId: objectUserId,
      });

      if (userBooking) {
        userBooking.bookings.push(bookingItem);
      } else {
        userBooking = new this.bookingModel({
          userId: objectUserId,
          bookings: [bookingItem],
        });
      }

      const saved = await userBooking.save();

      // Send mail
      const user = await this.userModel.findById(userId);
      if (user?.email) {
        await lastValueFrom(
          this.mailClient.emit('booking_mail_queue', {
            email: user.email,
            name: user.userName,
            seatNumber,
            busName: bus.busName,
            busNumber: bus.busNumber,
            bookingDate: bookingItem.bookingDate,
          }),
        );
      }

      return {
        userId: saved.userId,
        booking: saved.bookings[saved.bookings.length - 1],
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException('Failed to create booking.');
    }
  }

  async getUserBookings(userId: string) {
    try {
      const objectId = new Types.ObjectId(userId);

      const bookings = await this.bookingModel
        .findOne({ userId: objectId })
        .populate({
          path: 'bookings.scheduleId',
          select: 'departureTime arrivalTime busId',
          populate: {
            path: 'busId',
            select: 'busName',
          },
        });

      if (!bookings || bookings.bookings.length === 0) {
        throw new NotFoundException('No bookings found for this user');
      }

      return bookings;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch all Buses.');
    }
  }
  async updatebookingStatus(
    userId: string,
    bookingId: string,
    status: BookingStatus,
  ) {
    try {
      const bookingGroup = await this.bookingModel.findOne({
        userId: new Types.ObjectId(userId),
      });

      if (!bookingGroup) {
        throw new NotFoundException('Booking group not found');
      }

      const booking = bookingGroup.bookings.find(
        (b) => b._id?.toString() === bookingId,
      );

      if (!booking) {
        throw new NotFoundException('Booking not found in user bookings');
      }

      if (booking.status === status) {
        throw new BadRequestException(`Booking is already ${status}`);
      }

      if (status === BookingStatus.CANCELED) {
        const schedule = await this.scheduleModel.findById(booking.scheduleId);
        if (!schedule) {
          throw new NotFoundException('Schedule not found for booking');
        }

        const scheduleSeat = await this.ScheduleSeatModel.findOne({
          scheduleId: booking.scheduleId.toString(),
        });

        if (!scheduleSeat) {
          throw new NotFoundException('ScheduleSeat not found for schedule');
        }

        const seat = scheduleSeat.seats.find(
          (s) => s.seatNumber === booking.seatNumber,
        );

        if (!seat) {
          throw new NotFoundException('Seat not found in ScheduleSeat');
        }

        seat.available = true;
        seat.userId = null;
        scheduleSeat.availableSeats += 1;

        await scheduleSeat.save();
      }

      //  Update status in booking group
      booking.status = status;
      await bookingGroup.save();

      return {
        message: `Booking ${status} successfully`,
        booking,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update booking status');
    }
  }
}
