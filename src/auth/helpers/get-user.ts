import { ZEN_USER } from '../constants';
import { UserDto } from '../dto';

export function getUser(request: any): UserDto {
  return request[ZEN_USER];
}
