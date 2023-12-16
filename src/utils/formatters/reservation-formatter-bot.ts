import { IReserved, Seat } from "../../models";
import { calculatePrice } from "../calculate-price";

export async function reservationFormatterBot(reservations: IReserved[]){
  let formattedText = ''
  let delimiter = '-'.repeat(12)
  for(const item of reservations){
    const seat = await Seat.findOne({_id: item.seatId})
    const price = calculatePrice({price: seat!.cost, duration: item.duration})
    const reservation=`
      ${delimiter}\n
      \tid: ${item._id}\n
      \tпродолжительность: ${item.duration}\n
      \tзарезервировано на: ${item.reservedFrom}\n
      \tместо №: ${seat!.seatNumber}
      \t**Итого к оплате**: ${price}
    `
    formattedText += reservation
  }
  return formattedText
}