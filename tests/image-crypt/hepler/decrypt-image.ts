import { HEIGHT, WIDTH } from '../const/key-size';
import { CryptData, KeyArr } from '../types';
import { ColorOffset } from './color-offset';

/**
 * @return decrypted image buffer for saving or some other manipulations.
 * if key not correct fo this image -> return null
 */
export function DecryptImage({ data, key: str }: CryptData, width: number): Buffer | null {
  const key: ReturnType<typeof unFlat> = unFlat([...Buffer.from(str, 'base64')], Math.floor(WIDTH));
  let rgba: Buffer = Buffer.from(data);

  rgba = ColorOffset(rgba, key, width, WIDTH, HEIGHT);

  return rgba;
}

export function unFlat(arr: number[], width: number): KeyArr {
  return arr.reduce(
    (acc: number[][][], value: number): number[][][] => {
      const isPixelEnd: () => boolean = (): boolean => acc.at(-1).at(-1).length === 4;

      if (acc.at(-1).length === width && isPixelEnd()) {
        acc.push([[]]);
      }

      if (isPixelEnd()) {
        acc.at(-1).push([]);
      }

      acc.at(-1).at(-1).push(value);

      return acc;
    },
    [[[]]],
  ) as KeyArr;
}
