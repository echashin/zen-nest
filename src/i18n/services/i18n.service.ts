import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import { join } from 'path';

import { I18N_CONFIG_OPTIONS } from '../constants';
import { I18nConfigOptions } from '../interface';

@Injectable()
export class I18nService {
  constructor(@Inject(I18N_CONFIG_OPTIONS) private readonly options: I18nConfigOptions) {}

  getLanguages(): string[] {
    return this.options.languages;
  }

  getMaxLength(): number {
    return this.options.maxLength || 3000;
  }

  t(lang: string, key: string, params: any = {}): string {
    const path: string = join(this.options.folderPath, `${lang.toLowerCase()}.json`);
    const data: string = JSON.parse(readFileSync(path, { encoding: 'utf8' }));
    if (!data[key]) {
      throw new InternalServerErrorException(`I18n Key not found ${path} ${key}`);
    }
    const hbs: HandlebarsTemplateDelegate = Handlebars.compile(data[key]);
    return hbs(params);
  }
}
