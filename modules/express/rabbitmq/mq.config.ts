import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  RABBITMQ_URL: z.string().startsWith("amqp://").optional(),
});

export const env = envSchema.parse(process.env);

export default {
  rabbitmq: {
    url: env.RABBITMQ_URL || "amqp://0.0.0.0:5672",
  },
};
