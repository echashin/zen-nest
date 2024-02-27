import { DynamicModule, Module, Provider } from '@nestjs/common';

import { ZEN_AUTH_CONFIG_OPTIONS } from './constants';
import { AsyncAuthModuleOptions, AuthOptionsFactory, ZenAuthModuleOptions } from './interface';
import { AclService } from './services/acl.service';
import { AuthService } from './services/auth.service';
import { JwtService } from './services/jwt.service';

@Module({})
export class AuthModule {
  static register(options: ZenAuthModuleOptions): DynamicModule {
    return {
      module: AuthModule,
      providers: [
        {
          provide: ZEN_AUTH_CONFIG_OPTIONS,
          useValue: options,
        },
        {
          provide: `ZEN_AUTH_${options.scope.toUpperCase()}`,
          useFactory: (): AuthService => {
            return new AuthService(options);
          },
        },
        JwtService,
        AclService,
      ],
      exports: [JwtService, AclService],
    };
  }

  static registerAsync(options: AsyncAuthModuleOptions): DynamicModule {
    return {
      module: AuthModule,
      imports: options.imports || [],
      providers: this.createAsyncProviders(options),
      exports: [JwtService, AclService],
    };
  }

  private static createAsyncProviders(options: AsyncAuthModuleOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [...this.createAsyncOptionsProvider(options), JwtService, AclService];
    }
    return [
      ...this.createAsyncOptionsProvider(options),
      JwtService,
      AclService,
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(options: AsyncAuthModuleOptions): Provider[] {
    if (options.useFactory) {
      return [
        {
          provide: ZEN_AUTH_CONFIG_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        {
          provide: `ZEN_AUTH_${options.scope.toUpperCase()}`,
          useClass: AuthService,
        },
      ];
    }
    return [
      {
        provide: ZEN_AUTH_CONFIG_OPTIONS,
        useFactory: async (optionsFactory: AuthOptionsFactory) => await optionsFactory.createAuthOptions(),
        inject: [options.useExisting || options.useClass],
      },
      {
        provide: `ZEN_AUTH_${options.scope.toUpperCase()}`,
        useClass: AuthService,
      },
    ];
  }
}
