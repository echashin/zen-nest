import { DynamicModule, Inject, Module, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';

import { I18N_CONFIG_OPTIONS } from './constants';
import { I18nConfigOptions } from './interface';
import { I18nService } from './services/i18n.service';
import { I18nRule } from './validators';

@Module({})
export class I18nModule implements OnModuleInit {
  constructor(@Inject(I18N_CONFIG_OPTIONS) private readonly options: I18nConfigOptions) {}

  static register(options: I18nConfigOptions): DynamicModule {
    return {
      module: I18nModule,
      providers: [
        {
          provide: I18N_CONFIG_OPTIONS,
          useValue: options,
        },
        I18nRule,
        I18nService,
      ],
      exports: [I18nService, I18nRule],
    };
  }

  onModuleInit(): void {
    for (const language of this.options.languages) {
      const path: string = join(this.options.folderPath, `${language.toLowerCase()}.json`);
      if (!fs.existsSync(path)) {
        // eslint-disable-next-line no-console
        console.error(`i18n file not found: ${path}`);
        throw new Error(`i18n file not found:${path}`);
      }
    }
  }
}
