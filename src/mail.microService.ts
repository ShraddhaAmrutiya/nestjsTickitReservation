// // import { NestFactory } from '@nestjs/core';
// // import { AppModule } from './app.module';
// // import { MicroserviceOptions, Transport } from '@nestjs/microservices';

// // async function bootstrap() {
// //   const app = await NestFactory.createMicroservice<MicroserviceOptions>(
// //     AppModule,
// //     {
// //       transport: Transport.RMQ,
// //       options: {
// //         urls: ['amqp://localhost:5672'],
// //         queue: 'booking_mail_queue',
// //         queueOptions: {
// //           durable: true,
// //         },
// //       },
// //     },
// //   );

// //   await app.listen();
// //   console.log('Booking Mail Microservice is listening...');
// // }
// // void bootstrap();
// import { Injectable } from '@nestjs/common';
// import nodemailer from 'nodemailer';

// @Injectable()
// export class MailService {
//   private transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'shraddha.amrutiya@vindaloosofttech.com',
//       pass: 'isfe grmv jzkw ikjt',
//     },
//   });

//   async sendEmail(to: string, subject: string, text: string) {
//     const info = await this.transporter.sendMail({
//       from: '"Booking Service" <your-email@gmail.com>',
//       to,
//       subject,
//       text,
//     });

//     console.log('Message sent: %s', info.messageId);
//   }
// }

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
