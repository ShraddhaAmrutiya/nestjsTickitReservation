import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
export enum busType {
  SLEEPER = 'sleeper',
  VOLVO = 'volvo',
  LUXURY = 'luxury',
}

export class Seat {
  @ApiProperty({ example: '101Vol-1' })
  @IsString()
  seatNumber: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  available: boolean;
}
export class createBusDto {
  @ApiProperty({ example: 1, description: 'Unique bus number' })
  @IsNumber()
  @IsNotEmpty()
  busNumber: number;

  @ApiProperty({ example: 'Volvo AC Express', description: 'Name of the bus' })
  @IsString()
  @IsNotEmpty()
  busName: string;

  @ApiProperty({
    example: busType.VOLVO,
    enum: busType,
    required: true,
  })
  @IsEnum(busType, {
    message: `busType must be one of: ${Object.values(busType).join(', ')}`,
  })
  @IsNotEmpty()
  busType: busType;

  @ApiProperty({
    example: 40,
    description: 'Total number of seats to generate',
    required: false,
  })
  @IsNotEmpty()
  @IsNumber()
  totalSeats: number;
  @ApiProperty({
    type: [Seat],
    description: 'Array of seat objects (auto-generated)',
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Seat)
  seats?: Seat[];
}

export interface BusSummary {
  busNumber: string;
  busName: string;
  busType: string;
  totalSeats: number;
  availableSeats: number;
  bookedSeats: number;
}

export class UpdateBusDto extends PartialType(createBusDto) {}
