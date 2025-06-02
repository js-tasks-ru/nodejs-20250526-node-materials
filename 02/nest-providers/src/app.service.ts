import { Injectable } from '@nestjs/common';
import { I18nService } from './i18n/i18n.service';

@Injectable()
export class AppService {
  constructor(private readonly i18n: I18nService) {}

  getHello(locale?: string): string {
    return this.i18n.t('greeting', locale);
  }
}
