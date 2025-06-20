import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
// import { User } from './User.schema';
import { CreateUserDTO } from './dto/createUser.dto';
import { loginUserDTO } from './dto/loginUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/creat')
  create(@Body() user: CreateUserDTO) {
    return this.userService.create(user);
  }
  @Post('/login')
  login(@Body() user: loginUserDTO) {
    return this.userService.login(user);
  }
}
