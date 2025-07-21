import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/multipart')
  multipart(@Body() req) {
    console.log('body', req);
    return 'ok';
  }

  @Post('/:filename')
  uploadFile(@Req() req, @Param('filename') filename: string) {
    return this.appService.uploadFile(filename, req);
  }
}
