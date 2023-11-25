import { Response } from "express"
import { IReserved, ReservedSeats } from "../../models"
import { IUser } from "../../models/user"
import { validateDuration } from "../../utils/validate-duration"
import { getNextSteps } from "../../utils/get-next-steps"
import { addDurationToDate } from "../../utils/add-duration-to-date"
import { dateToMoment } from "../../utils/date-to-moment"
import { Moment } from "moment"

type Step3Args = {
  message: string
  user: IUser
  res: Response
  currentReservation: IReserved

}

export async function step3(args: Step3Args) {
  const {message, user, res, currentReservation} = args
  const isValidDuration = validateDuration(message)
    if(isValidDuration){
      let updateObj: { reservedTo?: Moment, step: number, duration: string, stepFinished: boolean} = 
        { step: 3, duration: message, stepFinished: true}
      if(currentReservation.reservedFrom){
        const reservedTo = addDurationToDate(
          dateToMoment(currentReservation.reservedFrom),
          message
        )
        updateObj['reservedTo'] = reservedTo
      }
      await ReservedSeats.updateOne(
        {user: user._id},
        { $set: updateObj }
      )
      const nextSteps = await getNextSteps(user)
      res.status(200).send(`Отлично! Продолжительность выбрана. ${nextSteps}`)
    }else{
      res.status(422).send('Invalid duration')
    }
}