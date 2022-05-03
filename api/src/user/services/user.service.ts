import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserI } from 'src/interfaces/user.interface';
import { DeleteResult, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserDto } from '../model/dots/user.dto';
import { User } from '../model/entities/user.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  // create new user
  async create(userInstance: UserDto): Promise<UserI> {
    // check if the user already exists
    const user = await this.getUserByUserName(userInstance.username);
    if (user) throw new ConflictException('user already exits');
    userInstance['password'] = await bcrypt.hash(userInstance['password'], 8);
    const newRecord = this.userRepo.create(userInstance);
    return this.saveUser(newRecord);
  }
  // findOne by id
  async findUserByID(id: string): Promise<User> {
    try {
      return this.userRepo.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException('Database Error');
    }
  }
  // findAll
  async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<Partial<User>>> {
    try {
      console.log(options);
      return paginate<Partial<UserI>>(this.userRepo, options);
    } catch (error) {
      throw new InternalServerErrorException('Database Error');
    }
  }

  // update
  async updateUser(id: string, userInstance: UserDto): Promise<UserI> {
    // check if user exists
    const user: User = await this.findUserByID(id);
    if (!user) throw new NotFoundException('invalid credentials2');
    // check if password matched
    if (!(await bcrypt.compare(userInstance.password, user.password)))
      throw new UnauthorizedException('invalid credentials');
    Object.assign(user, userInstance);
    return this.saveUser(user);
  }
  // delete
  async deleteUser(id: string, password: string): Promise<DeleteResult> {
    // check if user exists
    const user: User = await this.findUserByID(id);
    if (!user) throw new NotFoundException('invalid credentials');
    // check if password matched
    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('invalid credentials');
    return this.userRepo.delete({ id });
  }

  private async getUserByUserName(username: string): Promise<User> {
    try {
      return this.userRepo.findOne({ where: { username } });
    } catch (error) {
      throw new InternalServerErrorException('Database Error');
    }
  }

  private async saveUser(userRecord: UserI): Promise<UserI> {
    try {
      return this.userRepo.save(userRecord);
    } catch (error) {
      throw new InternalServerErrorException('Database Error');
    }
  }
}
