import * as path from 'node:path';
import * as fs from 'node:fs';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { AuthGuard } from '@nestjs/passport';

const callbackTemplate = fs.readFileSync(
  path.join(__dirname, 'client/callback.html.tpl'),
  { encoding: 'utf-8' },
);

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user, req);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Request() req) {
    return this.authService.terminateSession(req.session.id);
  }

  @Public()
  @UseGuards(AuthGuard('github'))
  @Get('github')
  github() {
    return 'ok';
  }

  @Public()
  @UseGuards(AuthGuard('github'))
  @Get('github/callback')
  async githubCallback(@Request() req) {
    const payload = await this.authService.login(req.user, req);
    return callbackTemplate.replace('{{sid}}', payload.sid);
  }

  @Get('profile')
  profile(@Request() request) {
    return {
      id: request.user.id,
      role: request.user.role,
      username: request.user.username,
    };
  }

  @Get('sessions')
  async getSessions(@Request() req) {
    return this.authService.getUserSessions(req.user.id);
  }

  @Delete('sessions/:id')
  async terminateSession(@Request() req, @Param('id') sessionId: string) {
    const session = await this.authService.getSessionById(sessionId);

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // Only allow users to terminate their own sessions
    if (session.user.id !== req.user.id) {
      throw new ForbiddenException(
        'You do not have permission to terminate this session',
      );
    }

    if (session.id === req.session.id) {
      throw new BadRequestException(
        'Cannot terminate the current session this way, use logout instead',
      );
    }

    await this.authService.terminateSession(sessionId);

    return { success: true, message: 'Session terminated successfully' };
  }
}
