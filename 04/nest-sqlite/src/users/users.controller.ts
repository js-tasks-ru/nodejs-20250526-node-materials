import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ExceptionHandler } from '@nestjs/core/errors/exception-handler';
import { QueryFailedErrorFilter } from '../filter/queryFailedError.filter';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  list() {
    return this.usersService.list();
  }

  @Post()
  create(@Body() body: any) {
    return this.usersService.create(body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
