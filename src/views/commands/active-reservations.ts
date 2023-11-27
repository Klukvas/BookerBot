import { Response } from "express";
import { ReservedSeats } from "../../models";
import { IUser } from "../../models/user";
import { sendResponse } from "../../utils/send-response";
import { activeReservationsResponse } from "../../utils/response-messages";
import { reservationFormatter } from "../../utils/formatters/reservation-formatter";

type ActiveReservationsArgs = {
  user: IUser
  res: Response
  chatId: number
}

export async function activeReservations({user, res, chatId}: ActiveReservationsArgs) {
    const reservations = await ReservedSeats.find({user: user._id, reservationFinished: true})
    if(reservations.length >= 1){
      const formattedReservations = await reservationFormatter(reservations)
      await sendResponse({
        message: `${activeReservationsResponse.listOfReservations}${formattedReservations}`,
        expressResp: res,
        chatId
      })
        // res.send(`Вот все ваши активные резервации.\n${textReservations}`)
    }else{
      await sendResponse({
        message: activeReservationsResponse.noActiveReservations,
        expressResp: res,
        chatId
      })
        // res.send(`У вас пока что нету активных резерваций. Что бы создать резервацию используйте команду /create-reservation`)
    }
    
}