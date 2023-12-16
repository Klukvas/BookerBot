import { ObjectId } from "mongodb"
import { ReservedSeats } from "../models"
import { sendResponse } from "../utils/send-response";
import { Response } from "express";
import { cancelReservationResponses } from "../utils/response-messages";
import moment from "moment";
import { logger } from "../core/logger";

type CancelReservationArgs = {
  reservationId: ObjectId
  res: Response
  chatId: number
}

export async function cancelReservation({reservationId, res, chatId}: CancelReservationArgs) {
  
  const reservation = await ReservedSeats.findById(reservationId);

  if(!reservation){
    await sendResponse({
      expressResp: res,
      chatId,
      message: cancelReservationResponses.selectedReservationNotFound
    })
  }else{
    if(reservation.reservationFinished){
      const targetDate = moment(reservation.reservedFrom).tz('UTC');
      const currentDate = moment().tz('UTC');
      const daysDifference = targetDate.diff(currentDate, 'days');
      logger.debug(`daysDifference: ${daysDifference}`)
      if(daysDifference < 1 && daysDifference > 0){
        await sendResponse({
          expressResp: res,
          chatId,
          message: cancelReservationResponses.reservationTooClose
        })
      }else{
        await ReservedSeats.deleteOne({_id: reservationId})
        await sendResponse({
          expressResp: res,
          chatId,
          message: cancelReservationResponses.reservationCanceled
        })
      }

    }else{
      await ReservedSeats.deleteOne({_id: reservationId})
      await sendResponse({
        expressResp: res,
        chatId,
        message: cancelReservationResponses.reservationCanceled
      })
    }
  }
}