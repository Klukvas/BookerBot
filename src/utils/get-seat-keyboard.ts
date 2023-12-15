import { ISeat } from "../models";
import { Keyboard, KeyboardButton } from "../types/keyboard";

type GetSeatKeyboardArgs = {
  seats: ISeat[] 
  seatsPerRow?: number
}

export function getSeatKeyboard({seats, seatsPerRow=3}: GetSeatKeyboardArgs): Keyboard {
  const seatMatrix: KeyboardButton[][] = [];
  let currentRow: KeyboardButton[] = [];

  seats.forEach((seat, index) => {
    currentRow.push({text: `Место №${seat.seatNumber}`, callback_data: `choosenSeat-${seat._id}`});

    if (currentRow.length === seatsPerRow || index === seats.length - 1) {
      seatMatrix.push([...currentRow]);
      currentRow = [];
    }
  });

  return {inline_keyboard: seatMatrix};
}
