import { ApiProperty } from '@nestjs/swagger';
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
export class UpdateBookingStatusDto {
  @ApiProperty({
    example: '688c8ae3d2d2f62cda453a17',
    description: 'User Booking Group ID',
  })
  @IsNotEmpty()
  @IsMongoId()
  userBookingId: string;

  @ApiProperty({
    example: '688c8ae3d2d2f62cda453a18',
    description: 'Single Booking ID to cancel',
  })
  @IsNotEmpty()
  @IsMongoId()
  bookingId: string;

  @ApiProperty({
    example: BookingStatus.CANCELED,
    enum: BookingStatus,
    description: 'New status for booking',
  })
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
