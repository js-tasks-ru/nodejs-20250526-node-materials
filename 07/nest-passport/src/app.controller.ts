import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { Roles } from './auth/roles.decorator';
import { Role } from './users/entities/user.entity';

@Controller()
export class AppController {
  constructor() {}

  @Get('/profile')
  profile(@Req() req: Request) {
    return req.user;
  }

  @Roles(Role.ADMIN)
  @Get('secret')
  secret() {
    return { secret: 'big-secret' };
  }
}
