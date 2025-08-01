import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MailService } from './mail.microService';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @MessagePattern('booking_mail_queue')
  async handleEmail(data: {
    email: string;
    name: string;
    seatNumber: string;
    busName: string;
    busNumber: string;
    bookingDate: Date;
  }) {
    console.log('📩 Received message for email:', data);

    const subject = `🎟️ Your Bus Ticket Confirmation`;

    const formattedDateTime = new Date(data.bookingDate).toLocaleString();

    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px; max-width: 600px; margin: auto;">
        <h2 style="color: #2E86C1;">🚌 Bus Ticket Confirmation</h2>
        <p>Hi <strong>${data.name}</strong>,</p>

        <p>Your booking is confirmed! Here are your trip details:</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ccc;">Bus Name</td>
            <td style="padding: 8px; border: 1px solid #ccc;"><strong>${data.busName}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ccc;">Bus Number</td>
            <td style="padding: 8px; border: 1px solid #ccc;">${data.busNumber}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ccc;">Seat Number</td>
            <td style="padding: 8px; border: 1px solid #ccc;">${data.seatNumber}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ccc;">Booking Date & Time</td>
            <td style="padding: 8px; border: 1px solid #ccc;">${formattedDateTime}</td>
          </tr>
        </table>

        <p style="margin-top: 20px;">Thank you for choosing our service! 🚌</p>
        <p style="color: #555;">- Bus Ticket Reservation Team</p>
      </div>
    `;

    await this.mailService.sendEmail(data.email, subject, '', html);
    console.log(' Email sent to', data.email);
  }
}
