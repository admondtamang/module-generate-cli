import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

import { config } from '../../../config';
import { logger } from '../../../lib/logger';
import { nodeMailerTransporter } from '../../../lib/nodemailer';

import { IEmailInterface, EmailTemplate } from './email.interface';

export const sendMail = (emailData: IEmailInterface) => {
  emailData.from = emailData.from || config.email.from;

  // handlebars config
  if (emailData.template) {
    const emailTemplate = fs.readFileSync(path.join(__dirname, `./templates/${emailData.template}.hbs`), 'utf8');
    const template = handlebars.compile(emailTemplate);
    emailData.template = emailTemplate as EmailTemplate;
    emailData.html = template(emailData.context);
  }

  nodeMailerTransporter.sendMail(emailData, (err, info) => {
    if (err) {
      throw err;
    } else {
      logger.info(`[EmailService] - Email sent successfully with response id ${info.response}`);
    }
  });
};
