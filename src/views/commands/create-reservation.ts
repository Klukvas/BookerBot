import { Response } from "express";
import { ReservedSeats } from "../../models";
import { IUser } from "../../models/user";
import { responseMessages } from "../../utils/response-messages";

type CreateReservationCommandArgs = {
  maxReservationsPerUser?: number;
  res: Response;
};

export async function createReservation(user: IUser, args: CreateReservationCommandArgs) {
  const { maxReservationsPerUser = 2, res } = args;

  // Remove expired reservations
  await ReservedSeats.deleteMany({ user: user._id, reservedTo: { $lte: new Date() }, reservationFinished: true });

  // Get all "active" reservations
  const finishedReservations = await ReservedSeats.find({ user: user._id, reservationFinished: true });

  // User should not have more than X active reservations
  if (finishedReservations.length >= maxReservationsPerUser) {
    res.status(400).send('Too many reservations');
    return;
  }

  // Delete any existing reservations in progress and create a new one
  await ReservedSeats.deleteMany({ user: user._id, reservationFinished: false });
  await ReservedSeats.create({
    user: user._id,
    step: 1,
    stepFinished: true,
  });

  res.status(200).send(responseMessages.createReservationStep1);
}
