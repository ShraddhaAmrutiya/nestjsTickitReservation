import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
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
  @ApiProperty({
    example: UserRole.USER,
    enum: UserRole,
    required: true,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
