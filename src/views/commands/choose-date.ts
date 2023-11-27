import { Response } from "express";
import { IReserved, ReservedSeats } from "../../models";
import { IUser } from "../../models/user";
import { expectAnoutherValue, responseMessages, step4Responses } from "../../utils/response-messages";
import { sendResponse } from "../../utils/send-response";

type ChooseDate = {
  currentReservation: IReserved | null;
  user: IUser;
  res: Response,
  chatId: number
}

export async function chooseDate({ user, currentReservation, res, chatId }: ChooseDate) {
  if (!currentReservation) {
    // Create a new reservation if it doesn't exist
    await ReservedSeats.create({ user: user._id, step: 4, stepFinished: false });
    await sendResponse({message: step4Responses.successCommand, expressResp: res, chatId})
    // res.status(200).send(step4Responses.successCommand);
  } else if (currentReservation.step === 2 && !currentReservation.stepFinished) {
    await sendResponse({message: expectAnoutherValue.expectSeatName, expressResp: res, chatId})
    // res.status(400).send(expectAnoutherValue.expectSeatName);
  } else if (currentReservation.step === 3 && !currentReservation.stepFinished) {
    await sendResponse({message: expectAnoutherValue.expectDuration, expressResp: res, chatId})
    // res.status(400).send(expectAnoutherValue.expectDuration);
  }else{
    // Update reservation to step 3
    await ReservedSeats.updateOne(
      { user: user._id },
      { $set: { step: 4, stepFinished: false } }
    );
    await sendResponse({message: step4Responses.successCommand, expressResp: res, chatId})
    // res.status(200).send(step4Responses.successCommand);
  }
  
}