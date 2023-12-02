import { Response } from "express";
import { ReservedSeats } from "../../models";
import { IUser } from "../../models/user";
import { step1Responses } from "../../utils/response-messages";
import env from "../../utils/core/env";
import { sendResponse } from "../../utils/send-response";

type CreateReservationCommandArgs = {
  res: Response
  user: IUser
  chatId: number
};

export async function createReservation({user, res, chatId}: CreateReservationCommandArgs) {
  // Remove expired reservations
  console.log('here 16')
  await ReservedSeats.deleteMany({ user: user._id, reservedTo: { $lte: new Date() }, reservationFinished: true });

  // Get all "active" reservations
  console.log('here 19')
  const finishedReservations = await ReservedSeats.find({ user: user._id, reservationFinished: true });

  // User should not have more than X active reservations
  if (finishedReservations.length >= env.maxReservationPerUser) {
    // res.status(400).send(step1Responses.tooManyReservations);
    await sendResponse({message: step1Responses.tooManyReservations, chatId, expressResp: res})
    return;
  }

  // Delete any existing reservations in progress and create a new one
  await ReservedSeats.deleteMany({ user: user._id, reservationFinished: false });
  await ReservedSeats.create({
    user: user._id,
    step: 1,
    stepFinished: true,
  });
  console.log('sendResponse next: ', sendResponse)
  await sendResponse({message: step1Responses.success, chatId, expressResp: res})
  // res.status(200).send(step1Responses.success);
}
