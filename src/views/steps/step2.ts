import { Response } from "express"
import { ReservedSeats, Seat } from "../../models"
import { IUser } from "../../models/user"
import { getNextSteps } from "../../utils/get-next-steps"
import { Message } from "../../types/new-message"
import { step2Responses } from "../../utils/response-messages"
import { sendResponse } from "../../utils/send-response"
import { logger } from "../../core/logger"
import { ObjectId } from "mongodb"
import { CallbackQury } from "../../types/callback-query"

type Step2Args = {
    callback: CallbackQury
    user: IUser
    res: Response
}

export async function step2({callback, user, res}: Step2Args) {
  logger.info(`Step2 started for user: ${user._id}`)
  let selectedSeatId
  const chatId = callback.message.chat.id
  try{
    selectedSeatId = callback.data.split('-')[1].trim()
  }catch(err){
    logger.error(`Error with parsing seatId: ${err}`)
    await sendResponse({
      message: step2Responses.seatNotFound,
      chatId: chatId,
      expressResp: res
    })
  }
  const selectedSeat = await Seat.findOne({_id: new ObjectId(selectedSeatId)});
  
  if(!selectedSeat){
    await sendResponse({
      message: step2Responses.seatNotFound,
      chatId: chatId,
      expressResp: res
    })
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
      chatId: chatId,
      expressResp: res,
      reply_markup: keyboardMarkup
    })
  }
    
}