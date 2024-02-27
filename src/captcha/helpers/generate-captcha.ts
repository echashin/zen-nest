import { CaptchaObj, ConfigObject, create } from 'svg-captcha';

export function generateCaptcha(options?: ConfigObject): CaptchaObj {
  options = options || ({} as ConfigObject);
  options.size = options.size > 0 ? options.size : 4;
  options.width = options.width || 160;
  options.height = options.height || 80;
  options.ignoreChars = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_+=<>?,./;:|{}[]~`;

  return create(options);
}
