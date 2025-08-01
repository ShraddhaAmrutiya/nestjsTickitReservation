import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'shraddha.amrutiya@vindaloosofttech.com',
      pass: 'isfe grmv jzkw ikjt',
    },
  });

  async sendEmail(to: string, subject: string, text: string, html?: string) {
    const mailOptions = {
      from: `"Booking Service" <shraddha.amrutiya@vindaloosofttech.com>`,
      to,
      subject,
      text,
      ...(html && { html }),
    };

    const info = await this.transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
  }
}
