import { ISeat } from "../../models";

export function seatFormatter(seats: ISeat[]){
  let formattedText = ''
  let delimeter = '-'.repeat(24)
  for(const item of seats){
      const formattedSeat = `
          ${delimeter}\n
          Номер: ${item.seatNumber}\n
          Цена в час: ${item.cost}\n
          Тип: ${item.type}\n
      `
      formattedText += formattedSeat
  }
  return formattedText
}