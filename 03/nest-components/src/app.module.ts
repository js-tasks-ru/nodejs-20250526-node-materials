import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { UAMiddleware } from './middlewares/ua.middleware';
import { MobileGuard } from './guard/mobile.guard';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: MobileGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UAMiddleware).forRoutes('*');
  }
}
