import { IReserved, Seat } from "../../models";
import { calculatePrice } from "../calculate-price";

export async function reservationFormatterBot(reservations: IReserved[], additionalData?: string){
  let formattedText = ''
  let delimiter = '-'.repeat(12)
  for(const item of reservations){
    const seat = await Seat.findOne({_id: item.seatId})
    const price = calculatePrice({price: seat!.cost, duration: item.duration})
    let formatterReservation =`${delimiter}\n`;
    if(additionalData){
      formatterReservation += additionalData
    }
    formatterReservation=`
    \tid: ${item._id}\n
    \tпродолжительность: ${item.duration}\n
    \tзарезервировано на: ${item.reservedFrom}\n
    \tместо №: ${seat!.seatNumber}
    \t**Итого к оплате**: ${price}\n`
    formattedText += formatterReservation
  }
  return formattedText
}