import { ReservedSeats } from "../models";
import { IUser } from "../models/user";
import { commandNames } from "./response-messages";



export async function getNextSteps(user: IUser) {

  let nextSteps = ''
  
  const reservedSeat = await ReservedSeats.findOne({user: user._id, reservationFinished: false})
  if(!reservedSeat){
    throw new Error(`Could not find reserved seat for next steps. User: ${user._id}`)
  }
  if(!reservedSeat.reservedFrom){
    nextSteps += `Вы можете выбрать желаемую дату используя команду ${commandNames.chooseDate}\n`
  }
  if(!reservedSeat.seatId){
    nextSteps += `Вы можете выбрать желаемое место используя команду ${commandNames.chooseSeat}}\n`
  }
  if(!reservedSeat.duration){
    nextSteps += `Вы можете выбрать продолжительность резервации используя команду ${commandNames.chooseDuration}\n`
  }
  if(nextSteps === ''){
    nextSteps += `Осталось лишь подтвердить вашу резервацию. Для этого используйте команду ${commandNames.approveReservation}\nДанные о резервации: ${reservedSeat}`
  }

  return nextSteps
    
}