import nodemailer from 'nodemailer';
import { config } from '../../config';

const emailSender = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: config.user_mailer,
      pass: config.mailer_pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: '"TaazaFol" <arfazahamed1@gmail.com>',
    to: email,
    subject: 'Reset password link',
    html,
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
};

export default emailSender;
