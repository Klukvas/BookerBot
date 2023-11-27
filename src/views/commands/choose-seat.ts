import { Response } from "express";
import { IReserved, ReservedSeats, Seat } from "../../models";
import { IUser } from "../../models/user";
import { findAvailableSeats } from "../../utils/find-available-seats";
import { expectAnoutherValue, step2Responses } from "../../utils/response-messages";
import { sendResponse } from "../../utils/send-response";
import { seatFormatter } from "../../utils/formatters/seat-formatter";


type ChooseSeatArgs = {
  currentReservation: IReserved | null;
  user: IUser;
  res: Response;
  chatId: number
};

export async function chooseSeat({ currentReservation, user, res, chatId }: ChooseSeatArgs) {
  let allSeats = await Seat.find({});
  let formattedAllSeats = seatFormatter(allSeats)

  try {
    if (!currentReservation) {
      await ReservedSeats.create({ user: user._id, step: 2, stepFinished: false });
      await sendResponse({
        message: `${step2Responses.successCommand}\n${formattedAllSeats}`,
        expressResp: res,
        chatId
      })
      // res.status(200).send(`${step3Responses.successCommand}${allSeats}`);
    } else if (currentReservation.step === 3 && !currentReservation.stepFinished) {
      await sendResponse({
        message: expectAnoutherValue.expectDuration,
        expressResp: res,
        chatId
      })
      // res.status(400).send(expectAnoutherValue.expectDuration);
    } else if (currentReservation.step === 4 && !currentReservation.stepFinished) {
      await sendResponse({
        message: expectAnoutherValue.expectDate,
        expressResp: res,
        chatId
      })
      // res.status(400).send(expectAnoutherValue.expectDate);
    } else {
      //If we have reservedFrom and reservedTo values - we could say which seats available for the user
      if(currentReservation.reservedFrom && currentReservation.reservedTo){
       const foundAvailableSeats = await findAvailableSeats({currentReservation})
       if(foundAvailableSeats.length >= 1){
          await ReservedSeats.updateOne(
            { user: user._id },
            { $set: { step: 2, stepFinished: false } }
          );
          const foundFormattedSeats = seatFormatter(foundAvailableSeats)
          await sendResponse({
            message: `${step2Responses.successCommand}${foundFormattedSeats}`,
            expressResp: res,
            chatId
          })
          // res.status(200).send(`${step3Responses.successCommand}${foundAvailableSeats}`);
        }else{
          //Todo: here should be suggestion
          await ReservedSeats.deleteOne({ user: user._id,  reservationFinished: false})
          await sendResponse({
            message: step2Responses.freeSeatNotFound,
            expressResp: res,
            chatId
          })
          // res.status(400).send(step2Responses.freeSeatNotFound)
        }
      }else{
        await ReservedSeats.updateOne(
          { user: user._id },
          { $set: { step: 2, stepFinished: false } }
        );
        await sendResponse({
          message: `${step2Responses.successCommand}${formattedAllSeats}`,
          expressResp: res,
          chatId
        })
        // res.status(200).send(`${step3Responses.successCommand}${allSeats}`);
      }
      
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Произошла ошибка при обработке запроса.');
  }
}
