import { ReservedSeats, Seat } from "../../models";

export async function createReservationStep4() {
  const seats = await Seat.find({})  

}