import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  //   UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { createBusDto } from './DTO/bus.dto';
import { Model } from 'mongoose';
import { bus } from './bus.schema';
import { InjectModel } from '@nestjs/mongoose';
import { BusSummary } from './DTO/bus.dto';
import { Schedule } from 'src/schedule/schedule.schema';
@Injectable()
export class BusService {
  constructor(
    @InjectModel(bus.name) private busModel: Model<bus>,
    @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
  ) {}
  async create(bus: createBusDto) {
    try {
      const existingBus = await this.busModel.findOne({
        busNumber: bus.busNumber,
      });

      if (existingBus) {
        throw new ConflictException('This bus number is already taken');
      }

      const seats = Array.from({ length: bus.totalSeats }, (_, i) => ({
        seatNumber: `${bus.busNumber}${bus.busName.slice(0, 3)}-${i + 1}`,
        available: true,
      }));

      const newBus = new this.busModel({
        ...bus,
        seats,
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
      const allBus = await this.busModel.aggregate<BusSummary>([
        {
          $project: {
            busNumber: 1,
            busName: 1,
            busType: 1,
            totalSeats: { $size: '$seats' },
            availabeSeats: {
              $size: {
                $filter: {
                  input: '$seats',
                  as: 'seat',
                  cond: { $eq: ['$$seat.available', true] },
                },
              },
            },
          },
        },
        {
          $addFields: {
            bookedSeats: { $subtract: ['$totalSeats', '$availabeSeats'] },
          },
        },
      ]);

      if (!allBus || allBus.length === 0) {
        throw new NotFoundException('No bus available');
      }

      return allBus;
    } catch (error) {
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
      await this.scheduleModel.deleteMany({ busId: id }).exec();

      return { message: `bus deleted successfully`, bus: bus.busName };
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
        bus.seats = Array.from({ length: bus.totalSeats }, (_, i) => ({
          seatNumber: `${existingBus.busNumber}${existingBus.busName.slice(0, 3)}-${i + 1}`,
          available: true,
        }));
      }

      const updatedBus = await this.busModel
        .findByIdAndUpdate(id, bus, {
          new: true,
        })
        .exec();

      return {
        message: 'Bus updated successfully',
        bus: updatedBus,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update bus.');
    }
  }
}
