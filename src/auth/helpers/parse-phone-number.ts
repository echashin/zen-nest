import * as libphonenumber from 'libphonenumber-js';
import { PhoneNumber } from 'libphonenumber-js';

export function parsePhoneNumber(fullPhoneNumber: string): { phoneCountryCode: string; phoneNumber: string } {
  const phoneNumberObj: PhoneNumber = libphonenumber.parsePhoneNumber(fullPhoneNumber);

  if (phoneNumberObj) {
    return {
      phoneCountryCode: phoneNumberObj.countryCallingCode,
      phoneNumber: phoneNumberObj.nationalNumber,
    };
  }

  return null;
}
