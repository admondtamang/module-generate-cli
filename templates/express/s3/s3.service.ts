import httpStatus from "http-status";
import createError from "http-errors";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import config from "./s3.config";
import { s3Client } from "./s3.lib";
import { generateString, getMime } from "./S3.helper";

import { IGeneratePresignedUrl } from "./s3.interface";

export const msToSeconds = (ms: number) => ms / 1000;

/**
 * Generates a signed URL for accessing an S3 object.
 * @param {string} key - The file name stored in s3.
 * @param {string} fileName - The file name stored in db.
 * @returns {Promise<{key: string, signedUrl: string}>>} The signed URL.
 */
export const generateSignedURL = async ({
  key,
  fileName,
  download,
}: {
  key: string;
  fileName: string;
  download: boolean;
}) => {
  const getObjectParams = {
    Bucket: config.aws.bucket,
    Key: key,
    ...(download
      ? { ResponseContentDisposition: `attachment;filename=${fileName}` }
      : {}), // use browser default download manager
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
export const generatePresignedUrl = async ({
  prefix = "",
  bucket,
  fileName,
}: IGeneratePresignedUrl) => {
  const mime = getMime(fileName);

  const key = prefix + `${await generateString(10)}_${Date.now()}.` + mime;

  const command = new PutObjectCommand({
    Bucket: bucket || config.aws.bucket,
    Key: key,
  });
  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: msToSeconds(config.aws.uploadSignedUrlExpiresIn),
  });
  return {
    key,
    signedUrl,
  };
};

export const getFileSize = async (key: string): Promise<number> => {
  const getObjectMetaDataParams = {
    Bucket: config.aws.bucket,
    Key: key,
  };

  const response = await s3Client.send(
    new HeadObjectCommand(getObjectMetaDataParams)
  );
  const sizeInBytes = response.ContentLength;

  if (!sizeInBytes) throw createError(httpStatus.NOT_FOUND, "File not found");

  return sizeInBytes;
};

export const deleteFile = (key: string) => {
  const deleteObjectParams = {
    Bucket: config.aws.bucket,
    Key: key,
  };

  return s3Client.send(new DeleteObjectCommand(deleteObjectParams));
};
