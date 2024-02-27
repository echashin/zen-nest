import { KeyArr } from '../types';

export function ColorOffset(rgba: Buffer, key: KeyArr, originalWidth: number, w: number, h: number): Buffer {
  let pixelNumber: number = -1;

  for (let i: number = 0; i < rgba.length; i++) {
    if (i % 4 === 0) {
      pixelNumber = pixelNumber + 1;
    }

    const x: number = (pixelNumber % originalWidth) % w;
    const y: number = Math.floor(pixelNumber / originalWidth) % h;

    rgba[i] = rgba[i] ^ key[y][x][i % 4];
  }

  return rgba;
}
