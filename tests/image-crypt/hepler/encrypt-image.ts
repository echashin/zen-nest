import { HEIGHT, WIDTH } from '../const/key-size';
import { CryptData, KeyArr } from '../types';
import { ColorOffset } from './color-offset';

export function EncryptImage(imageBitmap: Buffer, width: number): CryptData {
  let rgba: Buffer = Buffer.from(imageBitmap);
  const w: number = WIDTH;
  const h: number = HEIGHT;

  const key: KeyArr = [];

  for (let i: number = 0; i < h; i++) {
    key[i] = [];
    for (let j: number = 0; j < w; j++) {
      key[i][j] = [
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
      ];
    }
  }

  rgba = ColorOffset(rgba, key, width, w, h);

  return {
    data: rgba,
    key: Buffer.from(key.flat(2)).toString('base64'),
  };
}
