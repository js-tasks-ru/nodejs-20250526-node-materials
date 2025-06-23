import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';
import { Session } from './entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  async createSession(user: User, req: Request) {
    const userAgent = req.headers['user-agent'] || 'Unknown Device';
    const ipAddress = this.getClientIp(req);

    const deviceName = this.parseDeviceName(userAgent);

    const session = this.sessionRepository.create({
      deviceName,
      ipAddress,
      userAgent,
      user,
      lastActive: new Date(),
      createdAt: new Date(),
    });

    return this.sessionRepository.save(session);
  }

  async validateSession(sessionId: string) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['user'],
    });

    if (!session) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    await this.sessionRepository.update(
      { id: session.id },
      { lastActive: new Date() },
    );

    return session;
  }

  async getSessionsByUserId(userId: number) {
    return this.sessionRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async getSessionById(sessionId: string) {
    return this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['user'],
    });
  }

  async deleteSession(sessionId: string) {
    return this.sessionRepository.delete(sessionId);
  }

  private getClientIp(req: Request): string {
    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor) {
      return Array.isArray(forwardedFor)
        ? forwardedFor[0]
        : forwardedFor.split(',')[0].trim();
    }
    return req.socket.remoteAddress || 'Unknown';
  }

  private parseDeviceName(userAgent: string): string {
    let deviceName = 'Unknown Device';

    if (!userAgent) return deviceName;

    if (userAgent.includes('iPhone')) {
      deviceName = 'iPhone';
    } else if (userAgent.includes('iPad')) {
      deviceName = 'iPad';
    } else if (userAgent.includes('Android')) {
      deviceName = userAgent.includes('Mobile')
        ? 'Android Phone'
        : 'Android Tablet';
    } else if (userAgent.includes('Windows')) {
      deviceName = 'Windows Computer';
    } else if (
      userAgent.includes('Macintosh') ||
      userAgent.includes('Mac OS')
    ) {
      deviceName = 'Mac Computer';
    } else if (userAgent.includes('Linux')) {
      deviceName = 'Linux Computer';
    }

    if (userAgent.includes('Chrome') && !userAgent.includes('Chromium')) {
      deviceName += ' · Chrome';
    } else if (userAgent.includes('Firefox')) {
      deviceName += ' · Firefox';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      deviceName += ' · Safari';
    } else if (userAgent.includes('Edge')) {
      deviceName += ' · Edge';
    } else if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) {
      deviceName += ' · Internet Explorer';
    }

    return deviceName;
  }
}
