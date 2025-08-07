// import { Module } from '@nestjs/common';
// import { BookingController } from './booking.controller';
// import { BookingService } from './booking.service';
// import { MongooseModule } from '@nestjs/mongoose';
// import { scheduleSchema, Schedule } from '../schedule/schedule.schema';
// import { User, UserSchema } from '../user/User.schema';
// import { bus, BusSchema } from '../bus/bus.schema';
// import { booking, BookingSchema } from './booking.schema';
// import { ClientsModule, Transport } from '@nestjs/microservices';

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: Schedule.name, schema: scheduleSchema },
//       { name: User.name, schema: UserSchema },
//       { name: bus.name, schema: BusSchema },
//       { name: booking.name, schema: BookingSchema },
//     ]),
//     ClientsModule.register([
//       {
//         name: 'MAIL_SERVICE',
//         transport: Transport.RMQ,
//         options: {
//           urls: ['amqp://localhost:5672'],
//           queue: 'booking_mail_queue',
//           queueOptions: {
//             durable: true,
//           },
//         },
//       },
//     ]),
//   ],
//   controllers: [BookingController],
//   providers: [BookingService],
// })
// export class BookingModule {}

import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Schedule, scheduleSchema } from '../schedule/schedule.schema';
import { User, UserSchema } from '../user/User.schema';
import { bus, BusSchema } from '../bus/bus.schema';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BookingGroup, BookingSchema } from './booking.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  ScheduleSeat,
  ScheduleSeatSchema,
} from '../schedule-seat/schedule-seat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Schedule.name, schema: scheduleSchema },
      { name: ScheduleSeat.name, schema: ScheduleSeatSchema },
      { name: User.name, schema: UserSchema },
      { name: bus.name, schema: BusSchema },
      { name: 'booking', schema: BookingSchema },
    ]),
    ClientsModule.register([
      {
        name: 'MAIL_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'booking_mail_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
