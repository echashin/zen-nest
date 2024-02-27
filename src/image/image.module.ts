import { Global, Module } from '@nestjs/common';

import { ConfigurableModuleClass } from './image.module-definition';
import { ImageService } from './services/image.service';

@Global()
@Module({
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule extends ConfigurableModuleClass {}
