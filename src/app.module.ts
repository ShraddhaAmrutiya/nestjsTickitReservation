import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BusModule } from './bus/bus.module';
import { RoutesModule } from './BusRoutes/routes.module';
import { ScheduleModule } from './schedule/schedule.module';
import { UserModule } from './user/user.module';
import { BookingModule } from './booking/booking.module';
import { MongooseModule } from '@nestjs/mongoose';
import { StopModule } from './stop/stop.module';

@Module({
  imports: [
    BusModule,
    RoutesModule,
    ScheduleModule,
    UserModule,
    BookingModule,
    MongooseModule.forRoot(`mongodb://localhost:27017/ticket-reservation`),
    StopModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
