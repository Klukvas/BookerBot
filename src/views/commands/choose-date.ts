import { Response } from "express";
import { IReserved, ReservedSeats } from "../../models";
import { IUser } from "../../models/user";
import { expectAnoutherValue, responseMessages, step4Responses, valueAlreadySet } from "../../utils/response-messages";
import { sendResponse } from "../../utils/send-response";
import { getNextSteps } from "../../utils/get-next-steps";
import { createReservationIfNotExist } from "../create-reservation-if-not-exist";

type ChooseDate = {
  user: IUser;
  res: Response,
  chatId: number
}

export async function chooseDate({ user, res, chatId }: ChooseDate) {
  const {reservation, isNew} = await createReservationIfNotExist({user, step: 4})
  // if it is a recently created reservation -> skip processing
  if(isNew){
    await sendResponse({message: step4Responses.successCommand, expressResp: res, chatId})
    return
  }
  if (reservation.step === 2 && !reservation.stepFinished) {
    await sendResponse({message: expectAnoutherValue.expectSeatName, expressResp: res, chatId})
  } else if (reservation.step === 3 && !reservation.stepFinished) {
    await sendResponse({message: expectAnoutherValue.expectDuration, expressResp: res, chatId})
  } else if(reservation.reservedFrom){
    const {keyboardMarkup} = await getNextSteps(reservation)
    await sendResponse({expressResp: res, message: valueAlreadySet.date, chatId, reply_markup: keyboardMarkup})
  }else{
    // Update reservation to step 3
    await ReservedSeats.updateOne(
      { user: user._id, reservationFinished: false },
      { $set: { step: 4, stepFinished: false } }
    );
    await sendResponse({message: step4Responses.successCommand, expressResp: res, chatId})
  }
  
}