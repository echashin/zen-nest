import { ZenAuthServiceAbstract } from './zen-auth-service-abstract';

export interface ZenAuthModuleOptions {
  scope: string;
  accessToken: {
    secret: string;
    expires?: string;
  };

  refreshToken?: {
    secret: string;
    expires: string;
  };

  hash_salt?: string;
  authService: ZenAuthServiceAbstract;
}
