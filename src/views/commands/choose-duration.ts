import { Response } from "express";
import { IReserved, ReservedSeats } from "../../models";
import { IUser } from "../../models/user";
import { expectAnoutherValue, responseMessages, step3Responses, valueAlreadySet } from "../../utils/response-messages";
import { sendResponse } from "../../utils/send-response";
import { getNextSteps } from "../../utils/get-next-steps";
import { createReservationIfNotExist } from "../create-reservation-if-not-exist";

type ChooseDuration = {
  user: IUser;
  res: Response;
  chatId: number
};

export async function chooseDuration( { user, res, chatId }: ChooseDuration) {
  const {reservation, isNew} = await createReservationIfNotExist({user, step: 3})
  if(isNew){
    // if we created a new one -> we do not need to proccess it
    await sendResponse({expressResp: res, message: step3Responses.successCommand, chatId})
    return
  }

  if (reservation.step === 2 && !reservation.stepFinished) {
    await sendResponse({expressResp: res, message: expectAnoutherValue.expectSeatName, chatId})
  } else if (reservation.step === 4 && !reservation.stepFinished) {
    await sendResponse({expressResp: res, message: expectAnoutherValue.expectDate, chatId})
  }else if(reservation.duration){
    const {keyboardMarkup} = await getNextSteps(reservation)
    await sendResponse({expressResp: res, message: valueAlreadySet.duration, chatId, reply_markup: keyboardMarkup})
  }else{
    // Update reservation to step 3
    await ReservedSeats.updateOne(
      { user: user._id, reservationFinished: false},
      { $set: { step: 3, stepFinished: false } }
    );
    await sendResponse({expressResp: res, message: step3Responses.successCommand, chatId})
  }
  
}
