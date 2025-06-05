import { Injectable, NestMiddleware } from '@nestjs/common';
import { UAParser } from 'ua-parser-js';

@Injectable()
export class UAMiddleware implements NestMiddleware {
  use(req: any, res: any, next: any) {
    const parser = new UAParser(req.headers['user-agent']);
    req.ua = parser.getResult();
    next();
  }
}
