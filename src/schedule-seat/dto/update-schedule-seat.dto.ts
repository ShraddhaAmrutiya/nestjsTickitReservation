import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleSeatDto } from './create-schedule-seat.dto';

export class UpdateScheduleSeatDto extends PartialType(CreateScheduleSeatDto) {}
