import crypto from 'crypto';
import { promisify } from 'util';

const cryptoKeyLen: number = 32;

// eslint-disable-next-line @typescript-eslint/typedef
const cryptoScrypt = promisify(crypto.scrypt);

export function hashStringSync(text: string, salt: string): string {
  return crypto.scryptSync(text, salt, cryptoKeyLen).toString('hex');
}

export async function hashString(text: string, salt: string): Promise<string> {
  return ((await cryptoScrypt(text, salt, cryptoKeyLen)) as Buffer).toString('hex');
}

export async function hashCompare(plainText: string, salt: string, hashedText: string): Promise<boolean> {
  return (await hashString(plainText, salt)) === hashedText;
}
