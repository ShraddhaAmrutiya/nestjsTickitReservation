import { IsEmail, IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty({
    example: 'userName',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  userName: string;
  @ApiProperty({
    example: 'example@gmail.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ApiProperty({
    example: 'Password@123',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
  @ApiProperty({
    example: 23,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  age: number;
}
