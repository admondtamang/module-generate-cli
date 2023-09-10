import "dotenv/config";

import ms from "ms";
import { z } from "zod";

// validate environment variables to ensure they are available at runtime
const envSchema = z.object({
  BUCKET: z.string().optional(),
  AWS_REGION: z.string().nonempty(),
  AWS_ACCESS_KEY_ID: z.string().nonempty(),
  AWS_SECRET_ACCESS_KEY: z.string().nonempty(),
});

export const env = envSchema.parse(process.env);

export default {
  aws: {
    bucket: env.BUCKET,
    region: env.AWS_REGION,
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    uploadSignedUrlExpiresIn: ms("60m"), // since we are expecting large files, we are setting this to 60 minutes
  },
};
