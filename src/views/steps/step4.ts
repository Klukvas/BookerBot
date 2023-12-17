import { Response } from "express"
import { IUser } from "../../models/user"
import { validateDatetime } from "../../utils/validators/validate-datetime"
import { IReserved, ReservedSeats } from "../../models"
import { addDurationToDate } from "../../utils/add-duration-to-date"
import moment, { Moment } from "moment"
import { responseMessages, step3Responses, step4Responses } from "../../utils/response-messages"
import { getNextSteps } from "../../utils/get-next-steps"
import { Message } from "../../types/new-message"
import { sendResponse } from "../../utils/send-response"
import { logger } from "../../core/logger"
import env from "../../core/env"

type Step4Args = {
  user: IUser
  message: Message
  res: Response
  currentReservation: IReserved | null;
}

export async function step4(args: Step4Args) {
  const {message, user, res, currentReservation} = args
  const validatedDateTime = validateDatetime(message.text)
  if(validatedDateTime.isValid){
    if (!currentReservation) {
      await ReservedSeats.create({ 
        user: user._id, 
        step: 4, 
        stepFinished: true,
        reservedFrom: validatedDateTime.value
      });
    }else{
      const updateObj: { reservedFrom: string; reservedTo?: Moment, stepFinished: boolean} = {
        reservedFrom: validatedDateTime.value,
        stepFinished: true
      };
      if(currentReservation.duration){
        const reservedFrom = moment(validatedDateTime.value)
        const reservedTo = addDurationToDate(reservedFrom, currentReservation.duration)
        if(
          (reservedTo.hours() == env.closeHour && reservedTo.minutes() !== 0)
          ||
          reservedTo.hours() > env.closeHour
          ||
          reservedTo.date() !== reservedFrom.date()
        ){
         await sendResponse({
          expressResp: res,
          message: step3Responses.tooCloseToCloseTime,
          chatId: message.chat.id
         }) 
         return
        }else{
          updateObj.reservedTo = reservedTo
        }
        
      }
      // add duration to the start of reservation = time of reservaion ends
      const reservation = await ReservedSeats.findOneAndUpdate(
        {user: user._id, reservationFinished: false}, 
        {$set: updateObj},
        { new: true }
      )
      reservation
      logger.debug(`Date updated: ${JSON.stringify(reservation?.toJSON())}`)
      const {message: nextStepMessage, isLastStep, keyboardMarkup} = await getNextSteps(reservation!)
      const respMessage = isLastStep ?  `${step4Responses.success} ${nextStepMessage}` : step4Responses.success

      await sendResponse({
        message: respMessage,
        chatId: message.chat.id,
        expressResp: res,
        reply_markup: keyboardMarkup
      })
    }

  }else{
    await sendResponse({
      message: validatedDateTime.error,
      chatId: message.chat.id,
      expressResp: res
    })
  }

}