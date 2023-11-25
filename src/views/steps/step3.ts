import { Response } from "express"
import { ReservedSeats } from "../../models"
import { IUser } from "../../models/user"
import { validateDuration } from "../../utils/validate-duration"
import { getNextSteps } from "../../utils/get-next-steps"

type Step3Args = {
  message: string
  user: IUser
  res: Response

}

export async function step3(args: Step3Args) {
  const {message, user, res} = args
  const isValidDuration = validateDuration(message)
    if(isValidDuration){
      await ReservedSeats.updateOne(
        {user: user._id},
        { $set: { step: 3, duration: message, stepFinished: true} }
      )
      const nextSteps = await getNextSteps(user)
      res.status(200).send(`Отлично! Продолжительность выбрана. ${nextSteps}`)
    }else{
      res.status(422).send('Invalid duration')
    }
}