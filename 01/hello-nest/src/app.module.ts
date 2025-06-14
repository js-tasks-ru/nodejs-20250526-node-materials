import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}

/*
 * // node.http.js
 * export class Server {}
 * // index.js
 * import http from 'node:http';
 * */
