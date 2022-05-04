import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/model/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  generateJWT(payload: User): Promise<string> {
    const token = this.payloadHelper(payload);
    return this.jwt.signAsync(token);
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 8);
  }

  comparePassword(pass, hash): Promise<boolean> {
    return bcrypt.compare(pass, hash);
  }

  private payloadHelper(payload: User) {
    return {
      id: payload.id,
      name: payload.name,
      username: payload.username,
    };
  }
}
