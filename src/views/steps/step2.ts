import { Response } from "express"
import { ReservedSeats, Seat } from "../../models"
import { IUser } from "../../models/user"
import { getNextSteps } from "../../utils/get-next-steps"
import { Message } from "../../types/new-message"
import { step2Responses } from "../../utils/response-messages"
import { sendResponse } from "../../utils/send-response"

type Step2Args = {
    message: Message
    user: IUser
    res: Response
}

export async function step2(args: Step2Args) {
  const {message, user, res} = args
  const selectedSeat = await Seat.findOne({
    name: { $regex: new RegExp(`^${message.text.trim()}$`, 'i') }
  });
  
  if(!selectedSeat){
    await sendResponse({
      message: step2Responses.seatNotFound,
      chatId: message.chat.id,
      expressResp: res
    })
    // res.send(step2Responses.seatNotFound)
  }else{
    await ReservedSeats.updateOne(
      {user: user._id},
      {$set: {step: 2, stepFinished: true, seatId: selectedSeat._id}}
    )
    const {nextSteps, keyboard} = await getNextSteps(user)
    await sendResponse({
      message: `${step2Responses.success}\n${nextSteps}`,
      chatId: message.chat.id,
      expressResp: res,
      reply_markup: keyboard
    })
    // res.send(`${step2Responses.success}\n${nextSteps}`)
  }
    
}