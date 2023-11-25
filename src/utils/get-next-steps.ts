import { ReservedSeats } from "../models";
import { IUser } from "../models/user";



export async function getNextSteps(user: IUser) {

  let nextSteps = ''
  
  const reservedSeat = await ReservedSeats.findOne({user: user._id, reservationFinished: false})
  if(!reservedSeat){
    throw new Error(`Could not find reserved seat for next steps. User: ${user._id}`)
  }
  if(!reservedSeat.reservedFrom){
    nextSteps += 'Вы можете выбрать желаемую дату используя команду /choose-date\n'
  }
  if(!reservedSeat.seatId){
    nextSteps += 'Вы можете выбрать желаемое место используя команду /choose-seat\n'
  }
  if(!reservedSeat.duration){
    nextSteps += 'Вы можете выбрать продолжительность резервации используя команду /choose-duration\n'
  }
  if(nextSteps === ''){
    nextSteps += `Осталось лишь подтвердить вашу резервацию. Для этого используйте команду /approve-reservation\nДанные о резервации: ${reservedSeat}`
  }

  return nextSteps
    
}