import { IReserved, Seat } from "../../models";
import { calculatePrice } from "../calculate-price";
import { DurationHelper } from "../duration-helper";

export async function reservationFormatterBot(reservations: IReserved[], additionalData?: string){
  let formattedText = ''
  let delimiter = '-'.repeat(12)
  for(const item of reservations){
    
    let baseText = `${delimiter}\n\tid: ${item._id}\n`

    if(additionalData){
      baseText += additionalData
    }

    if(item.duration){
      const stringDuration = DurationHelper.minutesToString(item.duration)
      baseText+=`\tпродолжительность: ${stringDuration }\n`
    }

    if(item.reservedFrom){
      baseText+=`\tзарезервировано на: ${item.reservedFrom}\n`
    }
    if(item.seatId){
      const seat = await Seat.findOne({_id: item.seatId})
      baseText+= `\tместо №: ${seat!.seatNumber}\n`
      if(item.duration){
        const price = calculatePrice({price: seat!.cost, duration: item.duration})
        baseText+= `\t**Итого к оплате**: ${price}\n`
      }
    }
    formattedText += baseText
  }
  return formattedText
}