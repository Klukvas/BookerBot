import { Response } from "express"
import { ReservedSeats, Seat } from "../../models"
import { IUser } from "../../models/user"
import { getNextSteps } from "../../utils/get-next-steps"

type Step2Args = {
    message: string
    user: IUser
    res: Response
}

export async function step2(args: Step2Args) {
  const {message, user, res} = args
  const selectedSeat = await Seat.findOne({
    name: { $regex: new RegExp(`^${message.trim()}$`, 'i') }
  });
  
  if(!selectedSeat){
    res.send(`Возможно вы ошиблись. Но такого места не существует. Попробуйте еще раз`)
  }else{
    await ReservedSeats.updateOne(
      {user: user._id},
      {$set: {step: 2, stepFinished: true, seatId: selectedSeat._id}}
    )
    const nextSteps = await getNextSteps(user)
    res.send(`Супер, вы выбрали место!\n${nextSteps}`)
  }
    
}