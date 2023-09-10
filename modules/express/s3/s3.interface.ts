export interface IGeneratePresignedUrl {
  bucket?: string;
  fileName: string;
  prefix?: string;
}

export interface IFileUploadResult {
  key: string;
  mime: string;
  completedUrl: string;
  originalFileName: string;
  createdAt: Date;
}

export interface IPutFilesOptions {
  path?: string;
  bucketName?: string;
}
