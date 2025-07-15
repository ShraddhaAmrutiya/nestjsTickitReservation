import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ScheduleDto, UpdateScheduleDto } from './DTO/schedule.dto';
// import { Routdto } from 'src/BusRoutes/DTO/busroute.dto';
// import { createBusDto } from 'src/bus/DTO/bus.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Schedule } from './schedule.schema';
import { Routs } from './../BusRoutes/Route.schema';
import { bus } from 'src/bus/bus.schema';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
    @InjectModel(Routs.name) private routsModel: Model<Routs>,
    @InjectModel(bus.name) private busModel: Model<bus>,
  ) {}
  async create(schedule: ScheduleDto) {
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

      const newSchedule = new this.scheduleModel(schedule);
      return await newSchedule.save();
    } catch (error) {
      console.log(error);

      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof ConflictException) {
        throw error;
      }
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
}
