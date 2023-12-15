import { Response } from "express";
import { CallbackQury } from "../../types/new-message-types/callback-query"
import { commandNames } from "../../utils/response-messages";
import { chooseDuration } from "../commands/choose-duration";
import { chooseSeat } from "../commands/choose-seat";
import { createReservation } from "../commands/create-reservation";
import { createReservationIfNotExist } from "../create-reservation-if-not-exist";
import { CreateUserIfNotExist } from "../CreateUserIfNotExist";
import { chooseDate } from "../commands/choose-date";
import { ReservedSeats } from "../../models";
import { approveReservation } from "../commands/approve-reservation";
import { activeReservations } from "../commands/active-reservations";

type HandleCallbackQueryArgs = {
  callback: CallbackQury
  res: Response
}

export async function handleCallbackQuery({callback, res}: HandleCallbackQueryArgs) {
  /**
   * Here we are handling request when the user presses the button
   */
  const chatId = callback.chat.id
  let reservation;
  const user = await CreateUserIfNotExist(callback)
  
  switch (callback.data) {

    case commandNames.chooseDuration:
      reservation = await createReservationIfNotExist({user, step: 3})
      await chooseDuration({ currentReservation: reservation, user, res, chatId });
      break;

    case commandNames.chooseSeat:
      reservation = await createReservationIfNotExist({user, step: 2})
      await chooseSeat({ user, currentReservation: reservation, res, chatId });
      break;

    case commandNames.chooseDate:
      reservation = await createReservationIfNotExist({user, step: 4})
      await chooseDate({ user, currentReservation: reservation, res, chatId });
      break;

    case commandNames.approveReservation:
      reservation = await ReservedSeats.findOne({ user: user._id, reservationFinished: false });
      await approveReservation({ user, currentReservation: reservation, res, chatId });
      break;

    case commandNames.activeReservations:
      await activeReservations({ user, res, chatId });
      break;

  }
  
}