import nodemailer from 'nodemailer';

export async function sendEmail(recipient: string, emailBody: string) {

  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
      user: '',
      pass: ''
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