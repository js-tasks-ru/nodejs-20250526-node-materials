import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class StringTrimValidation implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const result = value.trim();
    if (result === '') throw new BadRequestException('string is empty');
    return result;
  }
}
