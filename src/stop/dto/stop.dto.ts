import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
export class StopDto {
  @ApiProperty({ example: 'stop1' })
  @IsString()
  @IsNotEmpty()
  stop: string;
}

export class UpdateStopDto extends PartialType(StopDto) {}
