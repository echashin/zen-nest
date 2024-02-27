import { RGB } from '@jimp/core';
import { Font } from '@jimp/plugin-print';
import Jimp from 'jimp';

export async function generateAvatar(width: number, height: number, firstName: string, lastName: string): Promise<Buffer> {
  try {
    const firstLetters: string = `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`;
    const randomColor: RGB = generateRandomBackgroundColor();
    const image: Jimp = new Jimp(width, height, numberToColor(randomColor));
    const font: Font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
    const textX: number = (image.getWidth() - Jimp.measureText(font, firstLetters)) / 2;
    const textY: number = (image.getHeight() - Jimp.measureTextHeight(font, firstLetters, width)) / 2;

    image.print(font, textX, textY, firstLetters);
    return image.getBufferAsync(Jimp.MIME_PNG);
  } catch {
    return Buffer.from('');
  }
}

function generateRandomBackgroundColor(): RGB {
  const minChannelValue: number = 50;
  const maxChannelValue: number = 180;

  const r: number = Math.floor(Math.random() * (maxChannelValue - minChannelValue + 1)) + minChannelValue;
  const g: number = Math.floor(Math.random() * (maxChannelValue - minChannelValue + 1)) + minChannelValue;
  const b: number = Math.floor(Math.random() * (maxChannelValue - minChannelValue + 1)) + minChannelValue;

  return { r, g, b };
}

function numberToColor(rgb: RGB): string {
  return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
}
