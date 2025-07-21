import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller()
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post('/orders')
  createOrder(@Body() payload: any) {
    return this.apiService.createOrder(payload);
  }
}
