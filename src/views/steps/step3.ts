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
        const reservedTo = addDurationToDate(
          dateToMoment(currentReservation.reservedFrom),
          message.text
        )
        updateObj['reservedTo'] = reservedTo
      }
      await ReservedSeats.updateOne(
        {user: user._id},
        { $set: updateObj }
      )
      const {nextSteps, keyboard} = await getNextSteps(user)
      await sendResponse({
        message: `${step3Responses.success}${nextSteps}`,
        expressResp: res,
        chatId: message.chat.id,
        reply_markup: keyboard
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