import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/createUser.dto';
import { loginUserDTO } from './dto/loginUser.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './User.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(user: CreateUserDTO) {
    try {
      const existingUser = await this.userModel.findOne({ email: user.email });
      if (existingUser) {
        throw new ConflictException('Use another email');
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = { ...user, password: hashedPassword };
      return await this.userModel.create(newUser);
    } catch (error) {
      console.log(error);

      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Failed to create user  ');
    }
  }

  async login(user: loginUserDTO) {
    try {
      const existingUser = await this.userModel.findOne({ email: user.email });
      if (!existingUser) {
        throw new NotFoundException('Use valid email');
      }

      const isPasswordValid = await bcrypt.compare(
        user.password,
        existingUser.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload = { sub: existingUser._id, email: existingUser.email };
      const token = this.jwtService.sign(payload);
      return {
        Message: 'User login successfully',
        token: token,
      };
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Failed to login.');
    }
  }
}
