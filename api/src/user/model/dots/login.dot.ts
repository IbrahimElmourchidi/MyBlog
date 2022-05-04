import { IsEmail, Matches } from 'class-validator';
export class LoginDto {
  @Matches('^(?=.*[A-Z].*[a-z])(?=.*[0-9]).{8,30}$')
  password: string;
  @IsEmail()
  email: string;
}
