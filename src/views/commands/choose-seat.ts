import { Response } from "express";
import { IReserved, ReservedSeats, Seat } from "../../models";
import { IUser } from "../../models/user";
import { findAvailableSeats } from "../../utils/find-available-seats";
import { expectAnoutherValue, step2Responses, valueAlreadySet } from "../../utils/response-messages";
import { sendResponse } from "../../utils/send-response";
import { seatFormatter } from "../../utils/formatters/seat-formatter";
import { logger } from "../../core/logger";
import { getNextSteps } from "../../utils/get-next-steps";
import { createReservationIfNotExist } from "../create-reservation-if-not-exist";
import { getSeatKeyboard } from "../../utils/get-seat-keyboard";


type ChooseSeatArgs = {
  user: IUser;
  res: Response;
  chatId: number
};

export async function chooseSeat({ user, res, chatId }: ChooseSeatArgs) {
  let allSeats = await Seat.find({});
  let formattedAllSeats = seatFormatter(allSeats)
  const {reservation, isNew} = await createReservationIfNotExist({user, step: 2})

  if(isNew){
    // if it is new reservation -> we could skip processing
    await sendResponse({
      message: `${step2Responses.successCommand}\n${formattedAllSeats}`,
      expressResp: res,
      chatId
    })
    return
  }

  try {
    if (reservation.step === 3 && !reservation.stepFinished) {
      await sendResponse({
        message: expectAnoutherValue.expectDuration,
        expressResp: res,
        chatId
      })
    } else if (reservation.step === 4 && !reservation.stepFinished) {
      await sendResponse({
        message: expectAnoutherValue.expectDate,
        expressResp: res,
        chatId
      })
    } else if(reservation.seatId){
      const {keyboardMarkup} = await getNextSteps(reservation)
      await sendResponse({expressResp: res, message: valueAlreadySet.seat, chatId, reply_markup: keyboardMarkup})
    } else {
      //If we have reservedFrom and reservedTo values - we could say which seats available for the user
      if(reservation.reservedFrom && reservation.reservedTo){
       const foundAvailableSeats = await findAvailableSeats({currentReservation: reservation})
       if(foundAvailableSeats.length >= 1){
          const keyboard = getSeatKeyboard({seats: foundAvailableSeats})
          await ReservedSeats.updateOne(
            { user: user._id, reservationFinished: false },
            { $set: { step: 2, stepFinished: false } }
          );
          const foundFormattedSeats = seatFormatter(foundAvailableSeats)
          await sendResponse({
            message: `${step2Responses.successCommand}${foundFormattedSeats}`,
            expressResp: res,
            chatId,
            reply_markup: keyboard
          })
        }else{
          //Todo: here should be suggestion
          await ReservedSeats.deleteOne({ user: user._id,  reservationFinished: false})
          await sendResponse({
            message: step2Responses.freeSeatNotFound,
            expressResp: res,
            chatId
          })
        }
      }else{
        await ReservedSeats.updateOne(
          { user: user._id, reservationFinished: false },
          { $set: { step: 2, stepFinished: false } }
        );
        await sendResponse({
          message: `${step2Responses.successCommand}${formattedAllSeats}`,
          expressResp: res,
          chatId
        })
      }
      
    }
  } catch (error) {
    logger.error(`Error with choosing seat: ${error}`)
    res.status(500).send('Произошла ошибка при обработке запроса.');
  }
}
