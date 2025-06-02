import { DynamicModule, Module } from '@nestjs/common';
import { I18nService } from './i18n.service';

export interface I18nOptions {
  defaultLocale: string;
  localesFolder: string;
}

@Module({})
export class I18nModule {
  static forRoot(options: I18nOptions): DynamicModule {
    return {
      module: I18nModule,
      providers: [
        {
          provide: 'I18N_OPTIONS',
          useValue: options,
        },
        I18nService,
      ],
      exports: [I18nService],
    };
  }
}
