import { generate } from 'generate-password';

export function generateTempPassword(): string {
  return generate({
    length: 10,
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
    excludeSimilarCharacters: true,
    strict: true,
    exclude: `<>|^~"'0OoIil;,:@{}[]\\()-_=+%$#^&*\`~.<>?/'“`,
  });
}
