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

import { UserDto } from '../model/dots/user.dto';
import { User } from '../model/entities/user.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { AuthService } from 'src/auth/services/auth.service';
import { LoginDto } from '../model/dots/login.dot';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private authService: AuthService,
  ) {}

  // create new user
  async create(userInstance: UserDto): Promise<UserI> {
    // check if the user already exists
    const user = await this.getUserByEmail(userInstance.email);
    if (user) throw new ConflictException('user already exits');
    const hash = await this.authService.hashPassword(userInstance.password);
    userInstance.password = hash;
    const newRecord = this.userRepo.create(userInstance);
    return this.saveUser(newRecord);
  }
  // findOne by id
  findUserByID(id: string): Promise<User> {
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
    const passMatches: boolean = await this.authService.comparePassword(
      userInstance.password,
      user.password,
    );
    if (!passMatches) throw new UnauthorizedException('invalid credentials');
    Object.assign(user, userInstance);
    return this.saveUser(user);
  }
  // delete
  async deleteUser(id: string, password: string): Promise<DeleteResult> {
    // check if user exists
    const user: User = await this.findUserByID(id);
    if (!user) throw new NotFoundException('invalid credentials');
    // check if password matched
    const passMatches: boolean = await this.authService.comparePassword(
      password,
      user.password,
    );
    if (!passMatches) throw new UnauthorizedException('invalid credentials');
    return this.userRepo.delete({ id });
  }

  async login(loginInstance: LoginDto): Promise<{ token: string }> {
    // check if user exist
    const user: User = await this.getUserByEmail(loginInstance.email);
    if (!user) throw new UnauthorizedException('invalid credentials');
    // verify the password
    const passMatches: boolean = await this.authService.comparePassword(
      loginInstance.password,
      user.password,
    );
    if (!passMatches) throw new UnauthorizedException('invalid credentials');
    const token: string = await this.authService.generateJWT(user);
    return { token };
  }

  private getUserByEmail(email: string): Promise<User> {
    try {
      return this.userRepo.findOne({ where: { email } });
    } catch (error) {
      throw new InternalServerErrorException('Database Error');
    }
  }

  private saveUser(userRecord: UserI): Promise<UserI> {
    try {
      return this.userRepo.save(userRecord);
    } catch (error) {
      throw new InternalServerErrorException('Database Error');
    }
  }
}
