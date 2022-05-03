import { IsString, Length, Matches } from 'class-validator';
import { UserI } from 'src/interfaces/user.interface';

export class UserDto {
  @IsString()
  @Length(2, 50)
  name: string;
  @IsString()
  @Length(2, 30)
  username: string;
  @Matches('^(?=.*[A-Z].*[a-z])(?=.*[0-9]).{8,30}$')
  password: string;
}
