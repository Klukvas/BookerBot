import { logger } from "../core/logger";
import { IReserved, ReservedSeats } from "../models";
import { IUser } from "../models/user";
import { reservationFormatterBot } from "./formatters/reservation-formatter-bot";
import { commandNames, nextStepMessages } from "./response-messages";



export async function getNextSteps(user?: IUser, reservation?:IReserved) {

  let nextSteps = ''
  const keyboard = {
    inline_keyboard: Array(),
    one_time_keyboard: true,
  }
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
    keyboard.inline_keyboard.push([{ text: '📅 Выберать дату', callback_data: commandNames.chooseDate }])
  }
  if(!reservedSeat.seatId){
    nextSteps += nextStepMessages.pickSeat
    keyboard.inline_keyboard.push([{ text: '💺 Выбрать место', callback_data: commandNames.chooseSeat }])
  }
  if(!reservedSeat.duration){
    nextSteps += nextStepMessages.pickDuration
    keyboard.inline_keyboard.push([{ text: '⏰ Выбрать продолжительность', callback_data: commandNames.chooseDuration }])
  }
  if(nextSteps === ''){
    const prettyReservations = await reservationFormatterBot([reservedSeat])
    nextSteps += nextStepMessages.noStepsLeft + `${prettyReservations}`
  }
  logger.debug(`keyboard: ${JSON.stringify(keyboard)}`)
  return {nextSteps, keyboard}
}