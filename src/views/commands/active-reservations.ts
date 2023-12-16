import { Response } from "express";
import { ReservedSeats } from "../../models";
import { IUser } from "../../models/user";
import { sendResponse } from "../../utils/send-response";
import { activeReservationsResponse } from "../../utils/response-messages";
import { reservationFormatterBot } from "../../utils/formatters/reservation-formatter-bot";
import { logger } from "../../core/logger";

type ActiveReservationsArgs = {
  user: IUser
  res: Response
  chatId: number
}

export async function activeReservations({user, res, chatId}: ActiveReservationsArgs) {
    const reservations = await ReservedSeats.find({user: user._id, reservationFinished: true})
    logger.info(`Active reservations command called. List of: ${JSON.stringify(reservations)}`)
    if(reservations.length >= 1){
      const formattedReservations = await reservationFormatterBot(reservations)
      await sendResponse({
        message: `${activeReservationsResponse.listOfReservations}${formattedReservations}`,
        expressResp: res,
        chatId
      })
    }else{
      await sendResponse({
        message: activeReservationsResponse.noActiveReservations,
        expressResp: res,
        chatId
      })
    }
    
}