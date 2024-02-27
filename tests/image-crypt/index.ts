import * as sharp from "sharp";
import * as path from "path";

import * as fs from "fs";
import {CryptData} from "./types";
import {DecryptImage, EncryptImage} from "./hepler";

export async function imageCrypt(): Promise<any> {
  const cpt: CryptData = await crypt();
  await decrypt(cpt.key);

  fs.writeFileSync(path.join(__dirname, 'key.txt'), cpt.key);
}

async function crypt(): Promise<CryptData> {
  const {data, info}: { data: Buffer, info: sharp.OutputInfo } = await sharp(path.join(__dirname, 'img.png'))
    .raw()
    .toBuffer({resolveWithObject: true})

  const crypt = EncryptImage(data, info.width);

  const pixelArray = new Uint8ClampedArray(crypt.data);

  const {width, height, channels}: sharp.OutputInfo = info;

  await sharp(pixelArray, {raw: {width, height, channels}})
    .toFile(path.join(__dirname, 'crypt.png'));

  return crypt;
}

async function decrypt(key: string): Promise<void> {
  const {data, info}: { data: Buffer, info: sharp.OutputInfo } = await sharp(path.join(__dirname, 'crypt.png'))
    .raw()
    .toBuffer({resolveWithObject: true})


  const decrypt = DecryptImage({key, data}, info.width);

  const pixelArray = new Uint8ClampedArray(decrypt);

  const {width, height, channels}: sharp.OutputInfo = info;


  await sharp(pixelArray, {raw: {width, height, channels}})
    .toFile(path.join(__dirname, 'decrypt.png'));
}
