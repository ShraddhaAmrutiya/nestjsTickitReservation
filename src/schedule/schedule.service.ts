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
// import { Routdto } from 'src/BusRoutes/DTO/busroute.dto';
// import { createBusDto } from 'src/bus/DTO/bus.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Schedule } from './schedule.schema';
import { Routs } from './../BusRoutes/Route.schema';
import { bus } from '../bus/bus.schema';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
    @InjectModel(Routs.name) private routsModel: Model<Routs>,
    @InjectModel(bus.name) private busModel: Model<bus>,
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

      // const recurrence = schedule.recurrence ?? RecurrenceType.NONE;
      // const maxOccurrences = 7;
      const recurrenceSchedules: ScheduleDto[] = [];

      if (schedule.recurrence && schedule.recurrence !== RecurrenceType.NONE) {
        const maxOccurrences = 6;

        for (let i = 0; i < maxOccurrences; i++) {
          const newDep = new Date(baseDeparture);
          const newArr = new Date(schedule.arrivalTime);

          if (schedule.recurrence === RecurrenceType.DAILY) {
            newDep.setDate(baseDeparture.getDate() + i);
            newArr.setDate(newArr.getDate() + i);
          } else if (schedule.recurrence === RecurrenceType.WEEKLY) {
            newDep.setDate(baseDeparture.getDate() + i * 7);
            newArr.setDate(newArr.getDate() + i * 7);
          }

          if (newDep < threeHoursLaterIST) continue;

          recurrenceSchedules.push({
            ...schedule,
            departureTime: newDep.toISOString(),
            arrivalTime: newArr.toISOString(),
          });
        }
      } else {
        // Only one-time schedule (non-recurring)
        recurrenceSchedules.push({
          ...schedule,
          departureTime: baseDeparture.toISOString(),
          arrivalTime: new Date(schedule.arrivalTime).toISOString(),
        });
      }

      const savedSchedules =
        await this.scheduleModel.insertMany(recurrenceSchedules);
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
        .find()
        .populate('busId')
        .populate('routId')
        .exec();

      if (!schedule) {
        throw new NotFoundException('No schedule found ');
      }
      return schedule;
    } catch (error) {
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

  @Cron(CronExpression.EVERY_MINUTE)
  async deleteExpiredSchedules() {
    const nowIST = new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000); // Convert to IST
    // const nowUTC = new Date(); // For logging

    const expiredSchedules = await this.scheduleModel.find({
      departureTime: { $lt: nowIST },
    });

    if (expiredSchedules.length === 0) {
      this.logger.log(`Current IST time: ${nowIST.toISOString()}`);
      this.logger.log('No expired schedules found.');
      return;
    }

    expiredSchedules.forEach((doc) => {
      this.logger.warn(
        `Deleting → ${doc._id.toString()} | ${doc.departureTime.toISOString()}`,
      );
    });

    const result = await this.scheduleModel.deleteMany({
      departureTime: { $lt: nowIST },
    });

    this.logger.log(`Deleted ${result.deletedCount} expired schedules.`);
  }
}
