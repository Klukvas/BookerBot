import { logger } from "../core/logger";
import { IReserved, ReservedSeats } from "../models";
import { IUser } from "../models/user";
import { reservationFormatterBot } from "./formatters/reservation-formatter-bot";
import { commandNames, nextStepMessages } from "./response-messages";
type KeyboardButton = {
  text: string;
  callback_data: string;
};

type Keyboard = {
  inline_keyboard: KeyboardButton[][];
}

type GetNextStepsResponse = {
  keyboardMarkup: Keyboard;
  isLastStep: boolean; 
  message: string | null;
};


export async function getNextSteps(reservation: IReserved): Promise<GetNextStepsResponse> {
  const keyboard: KeyboardButton[][] = [];
  let isLastStep = false
  let message = null;

  if (!reservation.reservedFrom) keyboard.push([{ text: '📅 Выберать дату', callback_data: commandNames.chooseDate }]);

  if (!reservation.seatId) keyboard.push([{ text: '💺 Выбрать место', callback_data: commandNames.chooseSeat }]);
  
  if (!reservation.duration) keyboard.push([{ text: '⏰ Выбрать продолжительность', callback_data: commandNames.chooseDuration }]);

  if (keyboard.length === 0) {
    const prettyReservations = await reservationFormatterBot([reservation]);
    keyboard.push([{ text: '🏁 Подтвердить резервацию', callback_data: commandNames.approveReservation }]);
    message = nextStepMessages.noStepsLeft + `${prettyReservations}`;
    isLastStep = true;
  }

  const keyboardMarkup = {
    inline_keyboard: keyboard,
    // one_time_keyboard: true,
  };

  return { keyboardMarkup, isLastStep: isLastStep, message };
}
