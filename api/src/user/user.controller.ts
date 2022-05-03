import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { UserI } from 'src/interfaces/user.interface';
import { UserDto } from './model/dots/user.dto';
import { User } from './model/entities/user.entity';
import { UserService } from './services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  create(@Body() userInstance: UserDto): Promise<Partial<User>> {
    return this.userService.create(userInstance);
  }

  @Get('/all')
  findAll(@Query('page') page, @Query('limit') limit) {
    try {
      const options: IPaginationOptions = {
        page: parseInt(page),
        limit: parseInt(limit) < 50 ? parseInt(limit) : 50,
        route: 'http://localhost:3000/user',
      };
      console.log(options);
      return this.userService.findAll(options);
    } catch (error) {
      throw new BadRequestException('bad request');
    }
  }
  @Get(':id')
  findUser(@Param('id') id: string): Promise<User> {
    return this.userService.findUserByID(id);
  }

  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() userInstance: UserDto,
  ): Promise<UserI> {
    return this.userService.updateUser(id, userInstance);
  }
}
