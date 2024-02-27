import { ModuleMetadata, Type } from '@nestjs/common';

import { ZenAuthModuleOptions } from './zen-auth-module-options';
export interface AuthOptionsFactory {
  createAuthOptions(): Promise<Omit<ZenAuthModuleOptions, 'scope'>> | Omit<ZenAuthModuleOptions, 'scope'>;
}
export interface AsyncAuthModuleOptions {
  scope: string;
  imports: ModuleMetadata['imports'];
  useExisting?: Type<AuthOptionsFactory>;
  useClass?: Type<AuthOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<Omit<ZenAuthModuleOptions, 'scope'>> | Omit<ZenAuthModuleOptions, 'scope'>;
  inject?: any[];
}
