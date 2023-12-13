import { IReserved, ReservedSeats } from "../models";
import { IUser } from "../models/user";
import { reservationFormatterBot } from "./formatters/reservation-formatter-bot";
import { nextStepMessages } from "./response-messages";



export async function getNextSteps(user?: IUser, reservation?:IReserved) {

  let nextSteps = ''
  let reservedSeat
  if(!reservation){
    reservedSeat = await ReservedSeats.findOne({user: user!._id, reservationFinished: false})
  }else{
    reservedSeat = reservation
  }
  
  if(!reservedSeat){
    throw new Error(`Could not find reserved seat for next steps. User: ${user!._id}`)
  }
  if(!reservedSeat.reservedFrom){
    nextSteps += nextStepMessages.pickDate
  }
  if(!reservedSeat.seatId){
    nextSteps += nextStepMessages.pickSeat
  }
  if(!reservedSeat.duration){
    nextSteps += nextStepMessages.pickDuration
  }
  if(nextSteps === ''){
    const prettyReservations = await reservationFormatterBot([reservedSeat])
    nextSteps += nextStepMessages.noStepsLeft + `${prettyReservations}`
  }

  return nextSteps
    
}