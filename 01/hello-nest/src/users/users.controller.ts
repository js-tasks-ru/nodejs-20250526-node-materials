import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';

// http://localhost:3000/users
// POST - create, GET - read, PATCH - update, DELETE - delete
// CRUD
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  listUsers() {
    return this.usersService.list();
  }

  @Get('/:id')
  getUser(@Param('id') id: string) {
    return this.usersService.get(id);
  }

  @Post()
  createUser(@Body() data) {
    return this.usersService.create(data);
  }

  @Patch('/:id')
  modifyUser(@Param('id') id: string, @Body() data) {
    return this.usersService.modify(id, data);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
