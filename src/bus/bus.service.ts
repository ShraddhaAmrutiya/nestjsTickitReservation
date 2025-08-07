import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { createBusDto } from './DTO/bus.dto';
import { Model } from 'mongoose';
import { bus } from './bus.schema';
import { InjectModel } from '@nestjs/mongoose';
// import { BusSummary } from './DTO/bus.dto';
import { Schedule } from '../schedule/schedule.schema';
import { ScheduleSeat } from 'src/schedule-seat/entities/schedule-seat.entity';
@Injectable()
export class BusService {
  constructor(
    @InjectModel(bus.name) private busModel: Model<bus>,
    @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
    @InjectModel(ScheduleSeat.name)
    private ScheduleSeatModel: Model<ScheduleSeat>,
  ) {}
  async create(bus: createBusDto) {
    try {
      const existingBus = await this.busModel.findOne({
        busNumber: bus.busNumber,
      });

      if (existingBus) {
        throw new ConflictException('This bus number is already taken');
      }

      const newBus = new this.busModel({
        ...bus,
        availabeSeats: bus.totalSeats,
      });
      return await newBus.save();
    } catch (error) {
      console.log(error);

      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Failed to create bus');
    }
  }

  async findAll() {
    try {
      const allBus = await this.busModel.find().exec();

      if (!allBus || allBus.length === 0) {
        throw new NotFoundException('No bus available');
      }

      return allBus;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch all Buses.');
    }
  }

  async findOne(id: string) {
    try {
      const bus = await this.busModel.findById(id).exec();
      if (!bus) {
        throw new NotFoundException('Bus not found');
      }
      return bus;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch bus');
    }
  }
  async delete(id: string) {
    try {
      const bus = await this.busModel.findByIdAndDelete(id).exec();
      if (!bus) {
        throw new NotFoundException('Bus not found');
      }

      // Step 1: Find all schedules for this bus
      const schedules = await this.scheduleModel.find({ busId: id }).exec();

      // Step 2: Extract schedule IDs
      const scheduleIds = schedules.map((schedule) => schedule._id);

      // Step 3: Delete all matching ScheduleSeat entries
      await this.ScheduleSeatModel.deleteMany({
        scheduleId: { $in: scheduleIds },
      }).exec();

      // Step 4: Delete all related schedules
      await this.scheduleModel.deleteMany({ busId: id }).exec();

      return { message: `Bus deleted successfully`, bus: bus.busName };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete bus');
    }
  }

  async update(id: string, bus: Partial<createBusDto>) {
    try {
      const existingBus = await this.busModel.findById(id).exec();

      if (!existingBus) {
        throw new NotFoundException('Bus not found');
      }
      if (
        bus.totalSeats !== undefined &&
        bus.totalSeats !== existingBus.totalSeats
      ) {
        throw new BadRequestException('Changing totalSeats is not allowed');
      }
      // Check if busNumber is being changed and validate uniqueness
      if (
        bus.busNumber !== undefined &&
        bus.busNumber !== existingBus.busNumber
      ) {
        const duplicateBus = await this.busModel.findOne({
          busNumber: bus.busNumber,
          _id: { $ne: id }, // Exclude current bus
        });

        if (duplicateBus) {
          throw new ConflictException(
            'This bus number is already taken by another bus',
          );
        }
      }

      // Only allow updates to busName and busNumber
      const updateData: Partial<createBusDto> = {};
      if (bus.busName !== undefined) updateData.busName = bus.busName;
      if (bus.busNumber !== undefined) updateData.busNumber = bus.busNumber;

      // Update the bus
      const updatedBus = await this.busModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();

      return {
        message: 'Bus updated successfully',
        bus: updatedBus,
      };
    } catch (error) {
      console.error(error);
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      )
        throw error;
      throw new InternalServerErrorException('Failed to update bus.');
    }
  }
}
