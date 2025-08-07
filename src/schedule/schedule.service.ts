import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import {
  // RecurrenceType,
  ScheduleDto,
  RecurrenceType,
  UpdateScheduleDto,
} from './DTO/schedule.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Schedule } from './schedule.schema';
import { ScheduleSeat } from '../schedule-seat/schedule-seat.schema';
import { Routs } from './../BusRoutes/Route.schema';
import { bus } from '../bus/bus.schema';
@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
    @InjectModel(Routs.name) private routsModel: Model<Routs>,
    @InjectModel(bus.name) private busModel: Model<bus>,
    @InjectModel(ScheduleSeat.name)
    private scheduleSeatModel: Model<ScheduleSeat>,
  ) {}

  private getISTTime(date: Date = new Date()): Date {
    const offset = 5.5 * 60 * 60 * 1000;
    return new Date(date.getTime() + offset);
  }

  async create(schedule: ScheduleDto) {
    try {
      const busExists = await this.busModel.findById(schedule.busId);
      if (!busExists) {
        throw new NotFoundException(`Bus with ID ${schedule.busId} not found`);
      }

      const routExists = await this.routsModel.findById(schedule.routId);
      if (!routExists) {
        throw new NotFoundException(
          `Route with ID ${schedule.routId} not found`,
        );
      }

      const istNow = this.getISTTime();
      const threeHoursLaterIST = new Date(
        istNow.getTime() + 3 * 60 * 60 * 1000,
      );
      const baseDeparture = this.getISTTime(new Date(schedule.departureTime));

      if (baseDeparture < threeHoursLaterIST) {
        throw new ConflictException(
          'Departure time must be at least 3 hours from now (IST)',
        );
      }

      const nowUTC = new Date();
      await this.scheduleModel.deleteMany({ departureTime: { $lt: nowUTC } });

      const recurrenceSchedules: ScheduleDto[] = [
        {
          ...schedule,
          departureTime: baseDeparture.toISOString(),
          arrivalTime: new Date(schedule.arrivalTime).toISOString(),
        },
      ];

      const savedSchedules =
        await this.scheduleModel.insertMany(recurrenceSchedules);

      for (const s of savedSchedules) {
        const seats = Array.from({ length: busExists.totalSeats }, (_, i) => ({
          seatNumber: `${busExists.busNumber}${busExists.busName.slice(0, 3)}-${i + 1}`,
          available: true,
          userId: null,
        }));

        const scheduleSeatDoc = new this.scheduleSeatModel({
          scheduleId: s._id.toString(),
          seats: seats,
          totalSeats: busExists.totalSeats,
          availableSeats: busExists.totalSeats,
        });

        await scheduleSeatDoc.save();
      }

      recurrenceSchedules.push({
        ...schedule,
        departureTime: baseDeparture.toISOString(),
        arrivalTime: new Date(schedule.arrivalTime).toISOString(),
      });
      console.log('savedSchedules', savedSchedules);
      return {
        message: 'Schedules created successfully',
        schedules: savedSchedules,
      };
    } catch (error) {
      console.error(error);
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      )
        throw error;
      throw new InternalServerErrorException('Failed to create schedule');
    }
  }

  async findOne(id: string) {
    try {
      const schedule = await this.scheduleModel
        .findById(id)
        .populate('busId')
        .populate('routId')
        .exec();

      if (!schedule) {
        throw new NotFoundException('No schedule found');
      }

      const scheduleSeat = await this.scheduleSeatModel
        .findOne({
          scheduleId: id,
        })
        .exec();

      const trimmedSeats =
        scheduleSeat?.seats.map((seat) => ({
          seatNumber: seat.seatNumber,
          available: seat.available,
        })) || [];

      return {
        ...schedule.toObject(),
        scheduleSeat: {
          scheduleId: scheduleSeat?.scheduleId,
          totalSeats: scheduleSeat?.totalSeats,
          availableSeats: scheduleSeat?.availableSeats,
          seats: trimmedSeats,
        },
      };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch schedule.');
    }
  }

  async findAll() {
    try {
      const schedule = await this.scheduleModel
        .find()
        .populate({ path: 'busId', select: '-seats' })
        .populate('routId')
        .exec();
      if (!schedule || schedule.length === 0) {
        throw new NotFoundException('There is no schedule.');
      }
      return schedule;
    } catch (error) {
      console.log(error);

      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch schedule.');
    }
  }

  async update(id: string, schedule: UpdateScheduleDto) {
    try {
      const busExists = await this.busModel.findById(schedule.busId);
      if (!busExists) {
        throw new NotFoundException(`Bus with ID ${schedule.busId} not found`);
      }
      const routExists = await this.routsModel.findById(schedule.routId);
      if (!routExists) {
        throw new NotFoundException(
          `Bus route with ID ${schedule.busId} not found`,
        );
      }
      const existingSchedule = await this.scheduleModel.findOne({
        busId: schedule.busId,
        routId: schedule.routId,
        depatureTime: schedule.departureTime,
      });
      if (existingSchedule) {
        throw new ConflictException(
          'Schedule already exists for this bus and route at the given time',
        );
      }
      const updateSchedule = await this.scheduleModel.findByIdAndUpdate(
        id,
        schedule,
        { new: true },
      );

      if (!updateSchedule) {
        throw new NotFoundException('Schedule not found for update');
      }

      return {
        message: 'Schedule updated successfully',
        Schedule: updateSchedule,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update route');
    }
  }
  async delete(id: string) {
    try {
      const schedule = await this.scheduleModel.findByIdAndDelete(id).exec();
      if (!schedule) {
        throw new NotFoundException('Schedule not found.');
      }
      return { message: 'Schedule deleted successfully', Schedule: schedule };
    } catch (error) {
      console.log(error);

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete schedule');
    }
  }

  private readonly logger = new Logger(ScheduleService.name);

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // or EVERY_MINUTE for testing
  @Cron(CronExpression.EVERY_MINUTE)
  async deleteExpiredSchedules() {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const expiredSchedules = await this.scheduleModel.find({
      departureTime: { $lt: sevenDaysAgo },
    });
    if (expiredSchedules.length === 0) {
      this.logger.log('No expired schedules found.');
      return;
    }

    // Log and delete associated ScheduleSeats
    const scheduleIds = expiredSchedules.map((s) => s._id);
    await this.scheduleSeatModel.deleteMany({
      scheduleId: { $in: scheduleIds },
    });

    // Delete the schedules
    const result = await this.scheduleModel.deleteMany({
      _id: { $in: scheduleIds },
    });

    this.logger.log(
      `Deleted ${result.deletedCount} expired schedules and related seats.`,
    );
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async rescheduleRecurringSchedules() {
    const now = new Date();

    const recurringSchedules = await this.scheduleModel.find({
      recurrence: { $in: [RecurrenceType.DAILY, RecurrenceType.WEEKLY] },
    });

    for (const schedule of recurringSchedules) {
      const futureSchedules = await this.scheduleModel.countDocuments({
        busId: schedule.busId,
        routId: schedule.routId,
        recurrence: schedule.recurrence,
        departureTime: { $gt: now },
      });

      const required = 7 - futureSchedules;
      if (required <= 0) continue;

      let lastDeparture = new Date(schedule.departureTime);
      let lastArrival = new Date(schedule.arrivalTime);

      const busExists = await this.busModel.findById(schedule.busId);
      if (!busExists) {
        this.logger.warn(`Bus with ID ${schedule.busId.toString()} not found`);
        continue;
      }

      for (let i = 0; i < required; i++) {
        const nextDeparture = new Date(lastDeparture);
        const nextArrival = new Date(lastArrival);

        if ((schedule.recurrence as RecurrenceType) === RecurrenceType.DAILY) {
          nextDeparture.setDate(nextDeparture.getDate() + 1);
          nextArrival.setDate(nextArrival.getDate() + 1);
        } else if (
          (schedule.recurrence as RecurrenceType) === RecurrenceType.WEEKLY
        ) {
          nextDeparture.setDate(nextDeparture.getDate() + 7);
          nextArrival.setDate(nextArrival.getDate() + 7);
        }

        const existing = await this.scheduleModel.findOne({
          departureTime: nextDeparture,
          busId: schedule.busId,
          routId: schedule.routId,
        });
        if (existing) continue;

        const newSchedule = new this.scheduleModel({
          ...schedule.toObject(),
          _id: undefined,
          departureTime: nextDeparture,
          arrivalTime: nextArrival,
        });

        await newSchedule.save();

        const seats = Array.from({ length: busExists.totalSeats }, (_, i) => ({
          seatNumber: `${busExists.busNumber}${busExists.busName.slice(0, 3)}-${i + 1}`,
          available: true,
          userId: null,
        }));

        const scheduleSeatDoc = new this.scheduleSeatModel({
          scheduleId: newSchedule._id.toString(),
          seats: seats,
          totalSeats: busExists.totalSeats,
          availableSeats: busExists.totalSeats,
        });

        await scheduleSeatDoc.save();

        this.logger.log(
          `Rescheduled [${schedule.recurrence}] → ${schedule._id.toString()} as → ${newSchedule._id.toString()}`,
        );

        lastDeparture = new Date(nextDeparture);
        lastArrival = new Date(nextArrival);
      }
    }
  }
}
