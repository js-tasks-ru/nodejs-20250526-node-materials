import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch(HttpException)
export class GqlHttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const status = exception.getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;

    const code =
      status === 404
        ? 'NOT_FOUND'
        : status >= 400 && status < 500
          ? 'BAD_REQUEST'
          : 'INTERNAL_SERVER_ERROR';

    return new GraphQLError(exception.message, {
      nodes: gqlHost.getInfo()?.fieldNodes,
      path: gqlHost.getInfo()?.path,
      extensions: {
        code,
        status,
      },
    });
  }
}
