import { ReservedSeats } from "../../models";
import { step1Responses } from "../../utils/response-messages";
import env from "../../core/env";
import { sendResponse } from "../../utils/send-response";
import { getNextSteps } from "../../utils/get-next-steps";
import { DefaultCommandProcessArgs } from "../../types/default-command-process-args";

export async function createReservation({user, res, chatId}: DefaultCommandProcessArgs) {
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
  const { keyboardMarkup } = await getNextSteps(reservation)
  await sendResponse({message: step1Responses.success, chatId, expressResp: res, reply_markup: keyboardMarkup})
}
