import { IReserved, Seat } from "../../models";
import { calculatePrice } from "../calculate-price";

export async function reservationFormatterBot(reservations: IReserved[], additionalData?: string){
  let formattedText = ''
  let delimiter = '-'.repeat(12)
  for(const item of reservations){
    
    let baseText = `${delimiter}\n\tid: ${item._id}\n`

    if(additionalData){
      baseText += additionalData
    }

    if(item.duration){
      baseText+=`\tпродолжительность: ${item.duration}\n`
    }

    if(item.reservedFrom){
      baseText+=`\tзарезервировано на: ${item.reservedFrom}\n`
    }
    if(item.seatId){
      const seat = await Seat.findOne({_id: item.seatId})
      const price = calculatePrice({price: seat!.cost, duration: item.duration})
      baseText+= `\tместо №: ${seat!.seatNumber}\n\tместо №: ${seat!.seatNumber}\n\t**Итого к оплате**: ${price}\n`
    }
    
    formattedText += baseText

  }
  return formattedText
}