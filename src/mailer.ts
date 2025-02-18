import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export async function sendEmail(recipient: string, emailBody: string) {

  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    }
  });

  const mailOptions = {
    from: 'Test operator',
    to: recipient,
    subject: 'Auto send',
    text: emailBody,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`Email sent to: ${recipient}, info: ${info.messageId}`);
}