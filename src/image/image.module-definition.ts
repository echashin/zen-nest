import { ConfigurableModuleBuilder } from '@nestjs/common';

import { ImageModuleOptions } from './interfaces/image-module-options';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } = new ConfigurableModuleBuilder<ImageModuleOptions>()
  .setClassMethodName('forRoot')
  .build();
