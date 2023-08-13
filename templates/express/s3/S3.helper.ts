import crypto from 'crypto';
import { promisify } from 'util';

const randomBytes = promisify(crypto.randomBytes);

export const generateString = async (length: number) => {
  const rawBytes = await randomBytes(length);
  const result = rawBytes.toString('hex');

  return result;
};

export const getMime = (fileName: string) => {
  return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();
};
