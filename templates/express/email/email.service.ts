import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import * as aws from "@aws-sdk/client-ses";

import { MailerParams, EmailTemplate } from "./email.interface";

const ses = new aws.SESClient({
  apiVersion: "2010-12-01",
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const nodeMailerTransporter = nodemailer.createTransport({
  SES: { ses, aws },
});

export function sendMail(emailData: MailerParams) {
  emailData.from = emailData.from || process.env.EMAIL_FROM;

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
