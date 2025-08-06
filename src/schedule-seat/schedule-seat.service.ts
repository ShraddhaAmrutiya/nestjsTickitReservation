import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScheduleSeat } from './schedule-seat.schema';
import { CreateScheduleSeatDto } from './dto/create-schedule-seat.dto';
import { UpdateScheduleSeatDto } from './dto/update-schedule-seat.dto';

@Injectable()
export class ScheduleSeatService {
  constructor(
    @InjectModel(ScheduleSeat.name)
    private scheduleSeatModel: Model<ScheduleSeat>,
  ) {}

  async create(dto: CreateScheduleSeatDto) {
    try {
      const created = new this.scheduleSeatModel(dto);
      return await created.save();
    } catch (error) {
      if (error instanceof error) throw error;
      throw new InternalServerErrorException('Failed to create seat.');
    }
  }

  async findAll() {
    return this.scheduleSeatModel.find().exec();
  }

  async findBySchedule(scheduleId: string) {
    return this.scheduleSeatModel.find({ scheduleId }).exec();
  }

  async findOne(id: string) {
    const seat = await this.scheduleSeatModel.findById(id);
    if (!seat) throw new NotFoundException('Seat not found');
    return seat;
  }

  async update(id: string, dto: UpdateScheduleSeatDto) {
    const updated = await this.scheduleSeatModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!updated) throw new NotFoundException('Seat not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.scheduleSeatModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Seat not found');
    return { message: 'Seat deleted successfully' };
  }
}
