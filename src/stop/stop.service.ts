import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { stop } from './stop.schema';
import { StopDto } from './dto/stop.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class StopService {
  constructor(@InjectModel(stop.name) private stopModel: Model<StopDto>) {}
  async create(stop: StopDto) {
    try {
      const existingstop = await this.stopModel.findOne({ stop: stop.stop });
      if (existingstop) {
        throw new ConflictException('This stop is already added');
      }
      return await this.stopModel.create(stop);
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Failed to create stop.');
    }
  }
  async FindOne(id: string) {
    try {
      const stop = await this.stopModel.findById(id).exec();
      if (!stop) {
        throw new NotFoundException('This stop not found.');
      }
      return stop;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch stop.');
    }
  }
  async findAll() {
    try {
      const stop = await this.stopModel.find().exec();
      if (!stop) {
        throw new NotFoundException('No stop found');
      }
      return stop;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch stops.');
    }
  }
  async delete(id: string) {
    try {
      const stop = await this.stopModel.findByIdAndDelete(id).exec();
      if (!stop) {
        throw new NotFoundException('No stop found');
      }
      return { message: 'Stop delete successfully', stop: stop.stop };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete stops.');
    }
  }
  async update(id: string, stop: Partial<StopDto>) {
    try {
      if (!stop.stop || stop.stop.trim() === '') {
        throw new BadRequestException('Stop name must not be empty.');
      }

      const existingstop = await this.stopModel.findOne({ stop: stop.stop });
      if (existingstop) {
        throw new ConflictException('This stop is already added');
      }

      const stops = await this.stopModel
        .findByIdAndUpdate(id, stop, { new: true })
        .exec();

      if (!stops) {
        throw new NotFoundException('No stop found');
      }

      return {
        message: 'stop updated successfully',
        stop: stops,
      };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      if (error instanceof ConflictException) throw error;
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException({
        error: 'Failed to update stops.',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
