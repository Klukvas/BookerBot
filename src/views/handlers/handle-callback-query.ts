import { Response } from "express";
import { CallbackQury } from "../../types/callback-query"
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
  const chatId = callback.message.chat.id
  let reservation;
  const user = await CreateUserIfNotExist(callback)
  
  switch (callback.data) {

    case commandNames.chooseDuration:
      await chooseDuration({user, res, chatId });
      break;

    case commandNames.chooseSeat:
      await chooseSeat({ user, res, chatId });
      break;

    case commandNames.chooseDate:
      await chooseDate({ user, res, chatId });
      break;

    case commandNames.approveReservation:
      await approveReservation({ user, res, chatId });
      break;

    case commandNames.activeReservations:
      await activeReservations({ user, res, chatId });
      break;
  }
  
}