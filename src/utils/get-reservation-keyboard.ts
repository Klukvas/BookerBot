import { IReserved } from "../models"
import { KeyboardButton } from "../types/keyboard"
import { cancelReservationCallbackPartial } from "./response-messages"

type ReservationWithId = {
  id: number
  reservation: IReserved
}

type GetReservationKeyboardArgs = {
  reservations: ReservationWithId[]
  reservationPerRow?: number
}

// todo: merge with get-seat-keyboard
export async function getReservationKeyboard({reservations, reservationPerRow=3}: GetReservationKeyboardArgs){
  const reservationMatrix: KeyboardButton[][] = [];
  let currentRow: KeyboardButton[] = [];

  reservations.forEach((_reservation, index) => {
    currentRow.push({text: `Id: ${_reservation.id}`, callback_data: `${cancelReservationCallbackPartial}-${_reservation.reservation._id}`});
    if (currentRow.length === reservationPerRow || index === reservations.length - 1) {
      reservationMatrix.push([...currentRow]);
      currentRow = [];
    }
  });
}