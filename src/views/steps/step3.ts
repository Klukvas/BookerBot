import { Response } from "express"
import { IReserved, ReservedSeats } from "../../models"
import { IUser } from "../../models/user"
import { validateDuration } from "../../utils/validators/validate-duration"
import { getNextSteps } from "../../utils/get-next-steps"
import { addDurationToDate } from "../../utils/add-duration-to-date"
import { dateToMoment } from "../../utils/date-to-moment"
import { Moment } from "moment"
import { Message } from "../../types/new-message"
import { step3Responses } from "../../utils/response-messages"
import { sendResponse } from "../../utils/send-response"
import { logger } from "../../core/logger"
import env from "../../core/env"

type Step3Args = {
  message: Message
  user: IUser
  res: Response
  currentReservation: IReserved

}

export async function step3(args: Step3Args) {
  const {message, user, res, currentReservation} = args
  const isValidDuration = validateDuration(message.text)
    if(isValidDuration){
      let updateObj: { reservedTo?: Moment, step: number, duration: string, stepFinished: boolean} = 
        { step: 3, duration: message.text, stepFinished: true}
      if(currentReservation.reservedFrom){
        const reservedFromMoment = dateToMoment(currentReservation.reservedFrom)
        const reservedTo = addDurationToDate(
          reservedFromMoment,
          message.text
        )
        logger.debug(`
        currentReservation.reservedFrom: ${currentReservation.reservedFrom}
        reservedFromMoment: ${reservedFromMoment}
        reservedTo: ${reservedTo}
        reservedTo.date(): ${reservedTo.date()}
        reservedFromMoment.date(): ${reservedFromMoment.date()}
        `)
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