import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { Request } from 'express';
import { AppService } from './app.service';
import { MobileGuard } from './guard/mobile.guard';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { IsEnum, IsString } from 'class-validator';
import { StringTrimValidation } from './validators/trim.validator';
import { IsUUID } from './validators/IsUUID';

enum Role {
  Admin = 'ADMIN',
  User = 'USER',
}

class UserDTO {
  @IsString()
  name: string;

  @IsEnum(Role)
  role: Role;

  @IsUUID({
    message: 'Not a valid UUID',
  })
  uuid: string;
}

@Controller()
// @UseGuards(MobileGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // @UseGuards(MobileGuard)
  // @UseInterceptors(TimeoutInterceptor)
  getHello(@Req() req: Request) {
    return this.appService.getHello(req.signal);
  }

  @Post()
  sayHi(@Body() body: UserDTO) {
    console.log(body);
    return `hi, ${body.name}, you are ${body.role}`;
  }

  @Post('/test')
  test(@Body('name', StringTrimValidation) name: string) {
    return `hi, ${name}`;
  }
}
