import type { IResult } from 'ua-parser-js';

declare global {
  namespace Express {
    interface Request {
      signal: AbortSignal;
      ua: IResult;
    }
  }
}

export {};
