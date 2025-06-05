import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getHello(signal: AbortSignal) {
    const response = await fetch('http://localhost:8080', { signal });

    // if (signal.aborted) return;
    // signal.onabort = () => {};

    const content = await response.text();
    return content;
  }
}
