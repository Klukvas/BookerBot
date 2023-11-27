import { Response } from "express";
import { IReserved, ReservedSeats } from "../../models";
import { IUser } from "../../models/user";
import { expectAnoutherValue, responseMessages, step3Responses } from "../../utils/response-messages";
import { sendResponse } from "../../utils/send-response";

type ChooseDuration = {
  currentReservation: IReserved | null;
  user: IUser;
  res: Response;
  chatId: number
};

export async function chooseDuration( { user, currentReservation, res, chatId }: ChooseDuration) {
  if (!currentReservation) {
    // Create a new reservation if it doesn't exist
    await ReservedSeats.create({ user: user._id, step: 3, stepFinished: false });
    await sendResponse({expressResp: res, message: step3Responses.successCommand, chatId})
    // res.status(200).send(step3Responses.successCommand);
  } else if (currentReservation.step === 2 && !currentReservation.stepFinished) {
    await sendResponse({expressResp: res, message: expectAnoutherValue.expectSeatName, chatId})
    // res.status(400).send(expectAnoutherValue.expectSeatName);
  } else if (currentReservation.step === 4 && !currentReservation.stepFinished) {
    await sendResponse({expressResp: res, message: expectAnoutherValue.expectDate, chatId})
    // res.status(400).send(expectAnoutherValue.expectDate);
  }else{
    // Update reservation to step 3
    await ReservedSeats.updateOne(
      { user: user._id },
      { $set: { step: 3, stepFinished: false } }
    );
    await sendResponse({expressResp: res, message: step3Responses.successCommand, chatId})

    // res.status(200).send(step3Responses.successCommand);
  }
  
}
