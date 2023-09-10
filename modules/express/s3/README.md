# S3 Module

Generating signed url for uploading and previewing files

## Required env variables

```
  BUCKET: '',
  AWS_REGION: '',
  AWS_ACCESS_KEY_ID: '',
  AWS_SECRET_ACCESS_KEY: '',

```

## Usage

### Packages Required

```
yarn add http-status http-errors @aws-sdk/client-s3 @aws-sdk/s3-request-presigner zod dotenv
```

### Implementation

```ts
// 1. signed url for previewing file
const key = "file-management/sample.pdf";
const fileName = "sample.pdf";
const downlaod = false as boolean;

const previewSignedUrl = await s3Service.generateSignedURL({
  key: key,
  fileName: fileName,
  download: download,
});

// 2. generate a pre-signed url for uploading the file
const fileName = "sample.pdf";
const prefix = "file-management/";

const { signedUrl: preSignedUploadUrl, key } =
  await s3Service.generatePresignedUrl({ prefix, fileName });

// Optionally for mime-types
import mime from "mime-types";
const mimeType = mime.lookup(fileName);

// 3. Delete file
await s3Service.deleteFile(file.key);
```
