import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export enum BookingStatus {
  BOOKED = 'booked',
  CANCELED = 'canceled',
}
export class BookingDto {
  @ApiProperty({ example: '60f7e8cfe13b1c00223d6c1d' })
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: '40f7e8cfe13b1c00223d6c2d' })
  @IsMongoId()
  @IsNotEmpty()
  scheduleId: string;

  @ApiProperty({ example: '2025-07-01T12:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  bookingDate: string;

  @ApiProperty({ example: BookingStatus.BOOKED, enum: BookingStatus })
  @IsEnum(BookingStatus)
  @IsNotEmpty()
  status: BookingStatus;
  @ApiProperty({ example: '1Vol-2' })
  @IsNotEmpty()
  @IsString()
  seatNumber: string;
}

export class UpdateBookingDto extends PartialType(BookingDto) {}
