import fs from 'fs';
import httpStatus from 'http-status';
import createError from 'http-errors';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand, PutObjectCommand, HeadObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

import { config } from '../../../config';
import { s3Client } from '../../../lib/aws';
import { generateString, getMime } from './S3.helper';
import { msToSeconds } from '../../../utils/msToSeconds';

import { IFileUploadResult, IGeneratePresignedUrl, IPutFilesOptions } from './s3.interface';

/**
 * Generates a signed URL for accessing an S3 object.
 * @param {string} key - The file name stored in s3.
 * @returns {Promise<{key: string, signedUrl: string}>>} The signed URL.
 */
export const generateSignedURL = async (key: string) => {
  const getObjectParams = {
    Bucket: config.aws.bucket,
    Key: key,
  };

  const command = new GetObjectCommand(getObjectParams);
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 120 });

  return {
    key,
    signedUrl,
  };
};

/**
 * Generates a presigned URL for uploading a file to an S3 bucket.
 * @param {object} params - The parameters for generating the presigned URL.
 * @param {string} params.bucket - The S3 bucket name.
 * @param {string} params.fileName - The desired file name.
 * @returns {Promise<{key: string, signedUrl: string}>} The presigned URL.
 */
export const generatePresignedUrl = async ({ prefix = '', bucket, fileName }: IGeneratePresignedUrl) => {
  const mime = getMime(fileName);

  const key = prefix + `${await generateString(10)}_${Date.now()}.` + mime;

  const command = new PutObjectCommand({ Bucket: bucket || config.aws.bucket, Key: key });
  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: msToSeconds(config.aws.uploadSignedUrlExpiresIn),
  });
  return {
    key,
    signedUrl,
  };
};

/**
 * Uploads multiple files to an S3 bucket.
 * @param {any[]} files - The array of files to upload.
 * @param {IOptions} [options] - The optional upload options.
 * @returns {Promise<IFileUploadResult[]>} The array of file upload results.
 */
export const putFilesToBucket = async (files: any, options?: IPutFilesOptions): Promise<IFileUploadResult[]> => {
  let path = options?.path;

  const bucketName = options?.bucketName || config.aws.bucket;

  return await Promise.all(
    files.map(async (file: any) => {
      const fileContent = fs.readFileSync(file.path);

      const originalname = file.originalname;
      const mime = getMime(originalname);

      const filename = `${await generateString(10)}_${Date.now()}.` + mime;
      if (path) path = path.startsWith('/') ? path.replace('/', '') : `${path}`;

      // path from aws
      const key = path ? `${path}/${filename}` : filename;
      const filePath = `https://${bucketName}.s3.amazonaws.com/${key}`;

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: fileContent,
      });

      await s3Client.send(command);

      return {
        key,
        mime,
        completedUrl: filePath,
        originalFileName: originalname,
        createdAt: new Date(),
      };
    }),
  );
};

export const getFileSize = async (key: string): Promise<number> => {
  const getObjectMetaDataParams = {
    Bucket: config.aws.bucket,
    Key: key,
  };

  const response = await s3Client.send(new HeadObjectCommand(getObjectMetaDataParams));
  const sizeInBytes = response.ContentLength;

  if (!sizeInBytes) throw createError(httpStatus.NOT_FOUND, 'File not found');

  return sizeInBytes;
};

export const deleteFile = (key: string) => {
  const deleteObjectParams = {
    Bucket: config.aws.bucket,
    Key: key,
  };

  return s3Client.send(new DeleteObjectCommand(deleteObjectParams));
};
