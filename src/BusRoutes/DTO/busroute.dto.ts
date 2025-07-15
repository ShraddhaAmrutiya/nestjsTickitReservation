import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsMongoId,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
// import { Type } from 'class-transformer';
// import { ValidateNested } from 'class-validator';

export class Routdto {
  @ApiProperty({ example: 'sector-1' })
  @IsString()
  @IsNotEmpty()
  from: string;

  @ApiProperty({ example: 'sector-5' })
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty({ example: 120 })
  @IsNumber()
  distance: number;

  @ApiProperty({ example: '2 hours' })
  @IsString()
  @IsNotEmpty()
  timeDuration: string;

  @ApiProperty({ example: ['60f7e8cfe13b1c00223d6c1d'] })
  @IsArray()
  @IsNotEmpty()
  @IsMongoId({ each: true })
  stop: string;
}

export class updateBusRoute extends PartialType(Routdto) {}
