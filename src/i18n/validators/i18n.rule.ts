import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import { I18nService } from '../services/i18n.service';

@ValidatorConstraint({ name: 'I18nRule', async: true })
@Injectable()
export class I18nRule implements ValidatorConstraintInterface {
  missingLanguages: string[] = [];
  maxLengthErrors: string[] = [];

  constructor(private readonly service: I18nService) {}

  async validate(value: Record<string, string>, args: ValidationArguments): Promise<boolean> {
    const required: boolean = !!args.constraints[0];
    this.missingLanguages = [];
    this.maxLengthErrors = [];

    if (required && !value) {
      return false;
    }

    const languages: string[] = this.service.getLanguages();
    for (const lang of languages) {
      if (value[lang]) {
        if (value[lang].length > this.service.getMaxLength()) {
          this.maxLengthErrors.push(lang);
        }
      } else {
        this.missingLanguages.push(lang);
      }
    }
    return this.missingLanguages.length <= 0;
  }

  defaultMessage(args: ValidationArguments): string {
    if (this.missingLanguages.length > 0) {
      return `Field ${args.property}: ${this.missingLanguages.join(', ')} is required`;
    }
    if (this.maxLengthErrors.length > 0) {
      return `Field ${args.property}: ${this.maxLengthErrors.join(', ')} too long, max length is ${this.service.getMaxLength()}`;
    }
  }
}
