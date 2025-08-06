export class CreateScheduleSeatDto {
  scheduleId: string;
  seatNumber: string;
  available?: boolean;
  userId?: string | null;
}
