import { Attachment } from "nodemailer/lib/mailer";

export type MailerParams = {
  from?: string;
  to: string | Array<string>;
  subject: string;
  context?: Record<string, any>;
  attachments?: Attachment[];
  template?: EmailTemplate;
  html?: string;
};

export type EmailTemplate = "welcome" | "verify-email";
