import { Response } from "express"
import { IUser } from "../../models/user"
import { validateDatetime } from "../../utils/validators/validate-datetime"
import { IReserved, ReservedSeats } from "../../models"
import { addDurationToDate } from "../../utils/add-duration-to-date"
import { Moment } from "moment"
import { responseMessages, step4Responses } from "../../utils/response-messages"
import { getNextSteps } from "../../utils/get-next-steps"
import { Message } from "../../types/new-message"
import { sendResponse } from "../../utils/send-response"

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
      const updateObj: { reservedFrom: Moment; reservedTo?: Moment, stepFinished: boolean} = {
        reservedFrom: validatedDateTime.value,
        stepFinished: true
      };
      if(currentReservation.duration){
        const reservedTo = addDurationToDate(validatedDateTime.value, currentReservation.duration)
        updateObj.reservedTo = reservedTo
      }
      // add duration to the start of reservation = time of reservaion ends
      await ReservedSeats.updateOne(
        {user: user._id, reservationFinished: false}, 
        {$set: updateObj}
      )
      const {nextSteps, keyboard} = await getNextSteps(user)
      await sendResponse({
        message: `${step4Responses.success}\n${nextSteps}`,
        chatId: message.chat.id,
        expressResp: res,
        reply_markup: keyboard
      })
      // res.send(`${step4Responses.success}\n${nextSteps}`)
    }

  }else{
    await sendResponse({
      message: validatedDateTime.error,
      chatId: message.chat.id,
      expressResp: res
    })
    // res.status(422).send(validatedDateTime.error)
  }

}