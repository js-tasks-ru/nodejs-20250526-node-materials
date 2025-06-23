import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';
import { SessionsService } from './sessions.service';
import { Request } from 'express';

@Injectable()
export class SessionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private sessionsService: SessionsService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const sessionId = this.extractSessionFromHeader(request);

    if (!sessionId) {
      throw new UnauthorizedException('No session provided');
    }

    try {
      const session = await this.sessionsService.validateSession(sessionId);

      request.user = session.user;
      request.session = session;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid session');
    }
  }

  private extractSessionFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Session' ? token : undefined;
  }
}
