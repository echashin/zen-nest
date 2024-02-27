import { UserDto } from '../dto';

export interface ZenAuthServiceAbstract {
  findUserByEmailAndPassword?: (email: string, password: string) => Promise<UserDto>;
  findUserByTokenAndCode?: (token: string, code: string) => Promise<UserDto>;
  findUserByRefreshToken?: (hashedRefreshToken: string, userId: string, deviceId: string) => Promise<UserDto>;
  checkPermissions: (role: string, aclResource: string, aclAction: string) => Promise<boolean>;
}
