import { Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';
import { SessionsService } from './sessions.service';
import { Session } from './entities/session.entity';

@Injectable()
export class AuthService {
  constructor(private sessionsService: SessionsService) {}

  async login(user: User, req: Request) {
    const session = await this.sessionsService.createSession(user, req);
    return { sid: session.id };
  }

  async getUserSessions(userId: number) {
    return this.sessionsService.getSessionsByUserId(userId);
  }

  async getSessionById(sessionId: string) {
    return this.sessionsService.getSessionById(sessionId);
  }

  async terminateSession(sessionId: string) {
    const session = await this.sessionsService.getSessionById(sessionId);

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return this.sessionsService.deleteSession(sessionId);
  }
}
