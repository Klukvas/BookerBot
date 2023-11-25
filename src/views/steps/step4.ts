import { Response } from "express"
import { IUser } from "../../models/user"
import { validateDatetime } from "../../utils/validate-datetime"
import { IReserved, ReservedSeats } from "../../models"
import { addDurationToDate } from "../../utils/add-duration-to-date"
import { Moment } from "moment"
import { responseMessages } from "../../utils/response-messages"
import { getNextSteps } from "../../utils/get-next-steps"

type Step4Args = {
  user: IUser
  message: string
  res: Response
  currentReservation: IReserved | null;
}

export async function step4(args: Step4Args) {
  const {message, user, res, currentReservation} = args
  const validatedDateTime = validateDatetime(message)
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
      const nextSteps = await getNextSteps(user)
      res.send(`Замечательно! Время установлено. ${nextSteps}`)
    }

  }else{
    res.status(422).send(validatedDateTime.error)
  }

}