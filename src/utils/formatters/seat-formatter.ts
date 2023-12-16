import { ISeat } from "../../models";

export function seatFormatter(seats: ISeat[]){
  let formattedText = ''
  let delimeter = '-'.repeat(24)
  for(const item of seats){
      const formattedSeat = `${delimeter}\nНомер: ${item.seatNumber}\nЦена в час: ${item.cost}\nТип: ${item.type}\n`
      formattedText += formattedSeat
  }
  return formattedText
}