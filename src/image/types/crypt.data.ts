export interface CryptData {
  /**
   * Crypt data. Image with pixel hell
   */
  data: Buffer;

  /**
   * Key for decrypt. Key size is ≈ 30 kB
   */
  key: string;
}
