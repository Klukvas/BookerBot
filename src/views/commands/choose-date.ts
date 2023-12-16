import { ReservedSeats } from "../../models";
import { expectAnoutherValue, step4Responses, valueAlreadySet } from "../../utils/response-messages";
import { sendResponse } from "../../utils/send-response";
import { getNextSteps } from "../../utils/get-next-steps";
import { createReservationIfNotExist } from "../create-reservation-if-not-exist";
import { DefaultCommandProcessArgs } from "../../types/default-command-process-args";

export async function chooseDate({ user, res, chatId }: DefaultCommandProcessArgs) {
  const {reservation, isNew} = await createReservationIfNotExist({user, step: 4})
  // if it is a recently created reservation -> skip processing
  if(isNew){
    await sendResponse({message: step4Responses.successCommand, expressResp: res, chatId})
    return
  }
  if (reservation.step === 2 && !reservation.stepFinished) {
    await sendResponse({message: expectAnoutherValue.expectSeat, expressResp: res, chatId})
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