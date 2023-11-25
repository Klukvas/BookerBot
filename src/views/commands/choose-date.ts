import { Response } from "express";
import { IReserved, ReservedSeats } from "../../models";
import { IUser } from "../../models/user";
import { responseMessages } from "../../utils/response-messages";

type ChooseDate = {
  currentReservation: IReserved | null;
  user: IUser;
  res: Response
}

export async function chooseDate(args: ChooseDate) {
  const { user, currentReservation, res } = args;

  if (!currentReservation) {
    // Create a new reservation if it doesn't exist
    await ReservedSeats.create({ user: user._id, step: 4, stepFinished: false });
    res.status(200).send(responseMessages.selectDate);
  } else if (currentReservation.step === 2 && !currentReservation.stepFinished) {
    res.status(400).send('Видимо, вы ошиблись. Ожидалось, что вы введете номер места');
  } else if (currentReservation.step === 3 && !currentReservation.stepFinished) {
    res.status(400).send('Видимо, вы ошиблись. Ожидалось, что вы введете продолжительность');
  }else{
    // Update reservation to step 3
    await ReservedSeats.updateOne(
      { user: user._id },
      { $set: { step: 4, stepFinished: false } }
    );
    res.status(200).send(responseMessages.selectDate);
  }
  
}