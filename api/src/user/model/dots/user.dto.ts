import { IsEmail, IsString, Length, Matches } from 'class-validator';

import { LoginDto } from './login.dot';

export class UserDto extends LoginDto {
  @IsString()
  @Length(2, 50)
  name: string;
  @IsString()
  @Length(2, 30)
  username: string;
}
