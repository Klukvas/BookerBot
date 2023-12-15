import { Response } from "express"
import { ReservedSeats, Seat } from "../../models"
import { IUser } from "../../models/user"
import { getNextSteps } from "../../utils/get-next-steps"
import { Message } from "../../types/new-message"
import { step2Responses } from "../../utils/response-messages"
import { sendResponse } from "../../utils/send-response"
import { logger } from "../../core/logger"

type Step2Args = {
    message: Message
    user: IUser
    res: Response
}

export async function step2(args: Step2Args) {
  const {message, user, res} = args
  let searchedSeatNumber
  try{
    searchedSeatNumber = Number(message.text.trim())
  }catch(err){
    await sendResponse({
      message: step2Responses.seatNotFound,
      chatId: message.chat.id,
      expressResp: res
    })
  }
  const selectedSeat = await Seat.findOne({seatNumber: searchedSeatNumber});
  
  if(!selectedSeat){
    await sendResponse({
      message: step2Responses.seatNotFound,
      chatId: message.chat.id,
      expressResp: res
    })
    // res.send(step2Responses.seatNotFound)
  }else{
    const reservation = await ReservedSeats.findOneAndUpdate(
      {user: user._id, reservationFinished: false},
      {$set: {step: 2, stepFinished: true, seatId: selectedSeat._id}},
      { new: true }
    )
    logger.debug(`Seat updated: ${JSON.stringify(reservation?.toJSON())}`)
    const {keyboardMarkup, isLastStep, message: nextStepMessage} = await getNextSteps(reservation!)
    const respMessage = isLastStep ?  `${step2Responses.success} ${nextStepMessage}` : step2Responses.success
    await sendResponse({
      message: respMessage,
      chatId: message.chat.id,
      expressResp: res,
      reply_markup: keyboardMarkup
    })
  }
    
}