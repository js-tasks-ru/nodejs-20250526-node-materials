import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { GithubStrategy } from './passport/github.strategy';

import { SessionsService } from './sessions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';

@Module({
  imports: [UsersModule, PassportModule, TypeOrmModule.forFeature([Session])],
  controllers: [AuthController],
  providers: [AuthService, SessionsService, LocalStrategy, GithubStrategy],
  exports: [SessionsService],
})
export class AuthModule {}
