import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Session } from '../../auth/entities/session.entity';

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

  @OneToMany(() => Session, (session) => session.user, { cascade: true })
  sessions: Session[];

  validatePassword(password: string) {
    return bcrypt.compare(password, this.password);
  }
}
