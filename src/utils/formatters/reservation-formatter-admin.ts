import { IReserved, Seat } from "../../models";
import { User } from "../../models/user";
import { calculatePrice } from "../calculate-price";
import { dateToMoment } from "../date-to-moment";

export async function reservationFormatterAdmin(reservation: IReserved){
  const seatName = (await Seat.findOne({_id: reservation.seatId}))?.seatNumber
  const rawUser = await User.findOne({_id: reservation.userId})
  const user = rawUser?.username || rawUser?.lastName || rawUser?.first_name
  const prettyReservedFrom = reservation.reservedFrom ? 
    dateToMoment(reservation.reservedFrom).format('DD/MM/YY HH:mm') : 
    "не выбрано"
  const prettyReservedTo = reservation.reservedTo ? 
    dateToMoment(reservation.reservedTo).format('DD/MM/YY HH:mm') : 
    "не выбрано"
  const prettyReservation = {
    id: reservation._id,
    reservedFrom: prettyReservedFrom,
    reservedTo: prettyReservedTo,
    totalAmountToPay: reservation.totalAmountToPay,
    seat: seatName || "не выбрано",
    user: user || "неизвестный",
  }
  return prettyReservation
}