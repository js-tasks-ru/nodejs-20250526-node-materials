import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { catchError, Observable, timeout, TimeoutError } from 'rxjs';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const controller = new AbortController();

    const request = context.switchToHttp().getRequest();
    request.signal = controller.signal;

    return next.handle().pipe(
      timeout(3_000),
      catchError((error) => {
        if (error instanceof TimeoutError) {
          controller.abort();
          throw new RequestTimeoutException();
        }
        throw error;
      }),
    );
  }
}
