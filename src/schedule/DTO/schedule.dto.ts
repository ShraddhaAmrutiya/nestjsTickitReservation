import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export enum RecurrenceType {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  TWICE_A_WEEK = 'twice_a_week',
}

export class ScheduleDto {
  @ApiProperty({ example: '60f7e8cfe13b1c00223d6c1d' })
  @IsMongoId()
  @IsNotEmpty()
  busId: string;

  @ApiProperty({ example: '40f7e8cfe13b1c00223d6c2d' })
  @IsMongoId()
  @IsNotEmpty()
  routId: string;

  @ApiProperty({ example: '2025-07-01T08:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  departureTime: string;

  @ApiProperty({ example: '2025-07-01T12:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  arrivalTime: string;

  @ApiProperty({
    example: RecurrenceType.NONE,
    enum: RecurrenceType,
    default: RecurrenceType.NONE,
    required: false,
  })
  @IsOptional()
  @IsEnum(RecurrenceType)
  recurrence?: RecurrenceType;
}

export class UpdateScheduleDto extends PartialType(ScheduleDto) {}
