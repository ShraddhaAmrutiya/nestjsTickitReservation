import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
// import { User } from './User.schema';
import { CreateUserDTO } from './dto/createUser.dto';
import { loginUserDTO } from './dto/loginUser.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/creat')
  create(@Body() user: CreateUserDTO) {
    return this.userService.create(user);
  }
  @Post('/login')
  @UsePipes(new ValidationPipe({ transform: true }))
  login(@Body() user: loginUserDTO) {
    return this.userService.login(user);
  }
}
