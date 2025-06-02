import { readdirSync, readFileSync } from 'node:fs';

import { Inject, Injectable } from '@nestjs/common';
import { type I18nOptions } from './i18n.module';
// Map, .set, .get, .has
// {}
@Injectable()
export class I18nService {
  private readonly locales = new Map<string, Record<string, string>>();

  constructor(@Inject('I18N_OPTIONS') private readonly options: I18nOptions) {
    console.log('I18nService service constructor', this.options);
    const files = readdirSync(this.options.localesFolder);
    for (const file of files) {
      const content = readFileSync(
        `${this.options.localesFolder}/${file}`,
        'utf-8',
      );
      this.locales.set(file.replace('.json', ''), JSON.parse(content));
    }
    console.log(this.locales);
  }

  t(key: string, locale: string = this.options.defaultLocale) {
    const dictionary =
      this.locales.get(locale) || this.locales.get(this.options.defaultLocale)!;
    return dictionary[key];
  }
}
