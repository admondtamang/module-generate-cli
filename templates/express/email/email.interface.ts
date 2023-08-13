import { Attachment } from 'nodemailer/lib/mailer';

export interface IEmailInterface {
  from?: string;
  to: string | Array<string>;
  subject: string;
  context?: Record<string, any>;
  attachments?: Attachment[];
  template?: EmailTemplate;
  html?: string;
}

export type EmailTemplate = 'welcome' | 'mfa' | 'registration-invite' | 'forgot-password' | 'axp-user-notifications';
