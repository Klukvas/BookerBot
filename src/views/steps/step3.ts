import { Response } from "express"
import { IReserved, ReservedSeats } from "../../models"
import { IUser } from "../../models/user"
import { getNextSteps } from "../../utils/get-next-steps"
import { dateToMoment } from "../../utils/date-to-moment"
import moment, { Moment } from "moment-timezone"
import { Message } from "../../types/new-message"
import { step3Responses } from "../../utils/response-messages"
import { sendResponse } from "../../utils/send-response"
import { logger } from "../../core/logger"
import env from "../../core/env"
import { DurationHelper } from "../../utils/duration-helper"

type Step3Args = {
  message: Message
  user: IUser
  res: Response
  currentReservation: IReserved

}

export async function step3({message, user, res, currentReservation}: Step3Args) {
  const isValidDuration = DurationHelper.isDurationValid(message.text)
    if(isValidDuration){
      let updateObj: { reservedTo?: Moment, step: number, duration: string, stepFinished: boolean} = 
        { step: 3, duration: message.text, stepFinished: true}
      if(currentReservation.reservedFrom){
        const reservedFromMoment = moment.utc(currentReservation.reservedFrom)
        const durationNumer = DurationHelper.stringToMinutes(message.text)
        const reservedTo = DurationHelper.addDurationToDate({duration: durationNumer, date: reservedFromMoment})
        if(
          (reservedTo.hours() == env.closeHour && reservedTo.minutes() !== 0)
          ||
          reservedTo.hours() > env.closeHour
          ||
          reservedTo.date() !== reservedFromMoment.date()
        ){
         await sendResponse({
          expressResp: res,
          message: step3Responses.tooCloseToCloseTime,
          chatId: message.chat.id
         }) 
         return
        }
        updateObj['reservedTo'] = reservedTo
      }
      const reservation = await ReservedSeats.findOneAndUpdate(
        {user: user._id, reservationFinished: false},
        { $set: updateObj },
        { new: true }
      )
      logger.debug(`Duration updated: ${JSON.stringify(reservation?.toJSON())}`)

      const {keyboardMarkup, isLastStep, message: nextStepMessage} = await getNextSteps(reservation!)
      const respMessage = isLastStep ?  `${step3Responses.success} ${nextStepMessage}` : step3Responses.success
      await sendResponse({
        message: respMessage,
        expressResp: res,
        chatId: message.chat.id,
        reply_markup: keyboardMarkup
      })
      // res.status(200).send(`${step3Responses.success}${nextSteps}`)
    }else{
      await sendResponse({
        message: step3Responses.invalidDuration,
        expressResp: res,
        chatId: message.chat.id
      })
      // res.status(422).send(step3Responses.invalidDuration)
    }
}