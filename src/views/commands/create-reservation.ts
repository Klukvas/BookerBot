import { Response } from "express";
import { ReservedSeats } from "../../models";
import { IUser } from "../../models/user";
import { step1Responses } from "../../utils/response-messages";
import env from "../../core/env";
import { sendResponse } from "../../utils/send-response";
import { getNextSteps } from "../../utils/get-next-steps";

type CreateReservationCommandArgs = {
  res: Response
  user: IUser
  chatId: number
};

export async function createReservation({user, res, chatId}: CreateReservationCommandArgs) {
  // Remove expired reservations
  await ReservedSeats.deleteMany({ user: user._id, reservedTo: { $lte: new Date() }, reservationFinished: true });

  // Get all "active" reservations
  const finishedReservations = await ReservedSeats.find({ user: user._id, reservationFinished: true });

  // User should not have more than X active reservations
  if (finishedReservations.length >= env.maxReservationPerUser) {
    // res.status(400).send(step1Responses.tooManyReservations);
    await sendResponse({message: step1Responses.tooManyReservations, chatId, expressResp: res})
    return;
  }

  // Delete any existing reservations in progress and create a new one
  await ReservedSeats.deleteMany({ user: user._id, reservationFinished: false });
  const reservation = await ReservedSeats.create({
    user: user._id,
    step: 1,
    stepFinished: true,
  })
  const { keyboard } = await getNextSteps(undefined, reservation)
  await sendResponse({message: step1Responses.success, chatId, expressResp: res, reply_markup: keyboard})
}
