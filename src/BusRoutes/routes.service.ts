import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Routs } from './Route.schema';
import { stop } from 'src/stop/stop.schema';
import { Routdto, updateBusRoute } from './DTO/busroute.dto';

@Injectable()
export class RoutesService {
  constructor(
    @InjectModel(Routs.name) private routModel: Model<Routs>,
    @InjectModel(stop.name) private stopModel: Model<stop>,
  ) {}

  async create(route: Routdto) {
    try {
      const existingrout = await this.routModel.findOne({
        from: route.from,
        to: route.to,
      });
      if (existingrout) {
        throw new ConflictException('rout is already exist.');
      }
      if (route.stop && route.stop.length) {
        const stops = await this.stopModel.find({ _id: { $in: route.stop } });

        if (stops.length !== route.stop.length) {
          throw new BadRequestException('One or more stop IDs are invalid.');
        }
      }
      return await this.routModel.create(route);
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to create bus rout.');
    }
  }
  async findOne(id: string) {
    try {
      const route = await this.routModel.findById(id).populate('stop stop');
      if (!route) {
        throw new NotFoundException(`Route  not found`);
      }
      return route;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch stop.');
    }
  }
  async findAll() {
    try {
      const routes = await this.routModel.find().populate('stop stop');

      if (!routes.length) {
        throw new NotFoundException('No routes found.');
      }

      return routes;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch routes.');
    }
  }

  async update(id: string, rout: updateBusRoute) {
    try {
      if (rout.stop && Array.isArray(rout.stop)) {
        const hasInvalidStop = rout.stop.some(
          (stopId) =>
            typeof stopId !== 'string' ||
            !stopId.trim() ||
            stopId.length !== 24,
        );

        if (hasInvalidStop) {
          throw new BadRequestException('Invalid stop ID(s) provided.');
        }
      }
      const route = await this.routModel
        .findByIdAndUpdate(id, rout, { new: true })
        .exec();

      if (!route) {
        throw new NotFoundException(`Route not found`);
      }

      return {
        message: 'Route updated successfully',
        Rout: route,
      };
    } catch (error: unknown) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException({
        error: 'Failed to update route.',
        message: errorMessage,
      });
    }
  }
  async delete(id: string) {
    try {
      const route = await this.routModel.findByIdAndDelete(id).exec();
      if (!route) {
        throw new NotFoundException(`Route not found`);
      }
      return {
        message: 'rout delete  successfully',
        Rout: route,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete Route.');
    }
  }
}
