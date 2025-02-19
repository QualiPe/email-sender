import nodemailer from 'nodemailer';
import { Logger } from '@nestjs/common';
import dotenv from 'dotenv';

dotenv.config();
const logger = new Logger('Mailer');

export async function sendEmail(
  recipient: string,
  subject: string,
  emailBody: string,
) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });

  const mailOptions = {
    from: `${process.env.USER_NAME} <${process.env.USER_EMAIL}>`,
    to: recipient,
    subject,
    text: emailBody,
  };

  const info = await transporter.sendMail(mailOptions);
  logger.log(`Email sent => ${recipient}, info: ${info.messageId}`);
}
