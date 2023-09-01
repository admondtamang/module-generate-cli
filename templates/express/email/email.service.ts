import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import * as aws from "@aws-sdk/client-ses";

import config from "./email.env";
import { MailerParams, EmailTemplate } from "./email.interface";

const ses = new aws.SESClient({
  apiVersion: "2010-12-01",
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

const nodeMailerTransporter = nodemailer.createTransport({
  SES: { ses, aws },
});

export function sendMail(emailData: MailerParams) {
  emailData.from = emailData.from || config.email.from;

  // handlebars config
  if (emailData.template) {
    const emailTemplate = fs.readFileSync(
      path.join(__dirname, `./templates/${emailData.template}.hbs`),
      "utf8"
    );
    const template = handlebars.compile(emailTemplate);
    emailData.template = emailTemplate as EmailTemplate;
    emailData.html = template(emailData.context);
  }

  nodeMailerTransporter.sendMail(emailData, (err, info) => {
    if (err) {
      console.log(`[EmailService] - Error sending email ${err}`);
    } else {
      console.log(
        `[EmailService] - Email sent successfully with response id ${info.response}`
      );
    }
  });
}
