import * as path from 'node:path';
import * as fs from 'node:fs';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
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
    return this.authService.login(req.user);
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
    const payload = await this.authService.login(req.user);
    return callbackTemplate
      .replace('{{accessToken}}', payload.accessToken)
      .replace('{{refreshToken}}', payload.refreshToken);
  }

  @Get('profile')
  profile(@Request() request) {
    return request.user;
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() body) {
    if (!body.refreshToken) {
      throw new BadRequestException('refreshToken is required');
    }

    return this.authService.refreshTokens(body.refreshToken);
  }
}
