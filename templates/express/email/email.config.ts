import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  BUCKET: z.string().optional(),
  EMAIL_FROM: z.string().nonempty(),
  AWS_REGION: z.string().nonempty(),
  AWS_ACCESS_KEY_ID: z.string().nonempty(),
  AWS_SECRET_ACCESS_KEY: z.string().nonempty(),
});

export const env = envSchema.parse(process.env);

export default {
  aws: {
    region: env.AWS_REGION,
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
  email: {
    from: process.env.EMAIL_FROM,
  },
};
