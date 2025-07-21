import { Injectable } from '@nestjs/common';
import { Bucket, Storage } from '@google-cloud/storage';
import { pipeline } from 'node:stream/promises';

const storage = new Storage();

@Injectable()
export class AppService {
  bucket: Bucket;

  constructor() {
    this.bucket = storage.bucket('nestjs-example-streaming');
  }

  async uploadFile(filename: string, req) {
    const file = this.bucket.file(filename);
    const fileStream = file.createWriteStream();

    await pipeline(req, fileStream);

    return 'all good';
  }
}
