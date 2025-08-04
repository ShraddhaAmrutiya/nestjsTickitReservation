// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { BusModule } from './bus/bus.module';
// import { RoutesModule } from './BusRoutes/routes.module';
// import { ScheduleModule } from './schedule/schedule.module';
// import { UserModule } from './user/user.module';
// import { BookingModule } from './booking/booking.module';
// import { MongooseModule } from '@nestjs/mongoose';
// import { StopModule } from './stop/stop.module';
// import { MailController } from './mail.controller';
// import { MailService } from './mail.microService';

// @Module({
//   imports: [
//     BusModule,
//     RoutesModule,
//     ScheduleModule,
//     UserModule,
//     BookingModule,
//     MongooseModule.forRoot(`mongodb://localhost:27017/ticket-reservation`),
//     StopModule,
//   ],
//   controllers: [AppController, MailController],
//   providers: [AppService, MailService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BusModule } from './bus/bus.module';
import { RoutesModule } from './BusRoutes/routes.module';
import { ScheduleModule as CustomScheduleModule } from './schedule/schedule.module'; // Rename to avoid conflict
import { UserModule } from './user/user.module';
import { BookingModule } from './booking/booking.module';
import { MongooseModule } from '@nestjs/mongoose';
import { StopModule } from './stop/stop.module';
import { MailController } from './mail.controller';
import { MailService } from './mail.microService';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://localhost:27017/ticket-reservation`),
    ScheduleModule.forRoot(),
    BusModule,
    RoutesModule,
    CustomScheduleModule,
    UserModule,
    BookingModule,
    StopModule,
  ],
  controllers: [AppController, MailController],
  providers: [AppService, MailService],
})
export class AppModule {}
