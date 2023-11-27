import { Response } from "express";
import { ReservedSeats } from "../../models";
import { IUser } from "../../models/user";
import { responseMessages, step1Responses } from "../../utils/response-messages";
import env from "../../utils/core/env";

type CreateReservationCommandArgs = {
  res: Response
  user: IUser
};

export async function createReservation({user, res}: CreateReservationCommandArgs) {
  // Remove expired reservations
  await ReservedSeats.deleteMany({ user: user._id, reservedTo: { $lte: new Date() }, reservationFinished: true });

  // Get all "active" reservations
  const finishedReservations = await ReservedSeats.find({ user: user._id, reservationFinished: true });

  // User should not have more than X active reservations
  if (finishedReservations.length >= env.maxReservationPerUser) {
    res.status(400).send(step1Responses.tooManyReservations);
    return;
  }

  // Delete any existing reservations in progress and create a new one
  await ReservedSeats.deleteMany({ user: user._id, reservationFinished: false });
  await ReservedSeats.create({
    user: user._id,
    step: 1,
    stepFinished: true,
  });
  res.status(200).send(step1Responses.success);
}
