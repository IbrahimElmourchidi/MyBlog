import { UserI } from 'src/interfaces/user.interface';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity()
export class User implements UserI {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id: string;

  @Column({
    length: 50,
    nullable: false,
  })
  name: string;
  @Column({
    length: 30,
    nullable: false,
    unique: true,
  })
  @Index()
  username: string;
  @Column({
    nullable: false,
    length: 60,
  })
  password: string;

  @Column({
    nullable: false,
    unique: true,
    length: 128,
  })
  email: string;

  @BeforeInsert()
  @BeforeUpdate()
  private dataToLower(): void {
    this.email = this.email.toLocaleLowerCase();
    this.username = this.username.toLocaleLowerCase();
  }
}
