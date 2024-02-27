import { Inject, Injectable } from '@nestjs/common';

import { MODULE_OPTIONS_TOKEN } from '../image.module-definition';
import { ImageModuleOptions } from '../interfaces';

@Injectable()
export class ImageService {
  constructor(@Inject(MODULE_OPTIONS_TOKEN) private options: ImageModuleOptions) {}

  //TODO
  async uploadImagesToBucket(): Promise<void> {
    return;
  }
}
