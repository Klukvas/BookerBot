import { ReservedSeats } from "../../models";
import { expectAnoutherValue, responseMessages, step3Responses, valueAlreadySet } from "../../utils/response-messages";
import { sendResponse } from "../../utils/send-response";
import { getNextSteps } from "../../utils/get-next-steps";
import { createReservationIfNotExist } from "../create-reservation-if-not-exist";
import { DefaultCommandProcessArgs } from "../../types/default-command-process-args";

export async function chooseDuration( { user, res, chatId }: DefaultCommandProcessArgs) {
  const {reservation, isNew} = await createReservationIfNotExist({user, step: 3})
  if(isNew){
    // if we created a new one -> we do not need to proccess it
    await sendResponse({expressResp: res, message: step3Responses.successCommand, chatId})
    return
  }

  if (reservation.step === 2 && !reservation.stepFinished) {
    await sendResponse({expressResp: res, message: expectAnoutherValue.expectSeat, chatId})
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
