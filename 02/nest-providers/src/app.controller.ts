import { Controller, Get, Headers } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Headers('accept-language') locale: string): string {
    const groups = locale?.split(';') || [];
    const primaryLocale = groups.at(0)?.split(',')?.at(0);

    return this.appService.getHello(primaryLocale);
  }
}
