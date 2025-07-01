import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: Role.USER })
  role: Role;

  @Column({ nullable: true })
  refreshToken: string;

  validatePassword(password: string) {
    return bcrypt.compare(password, this.password);
  }
}
