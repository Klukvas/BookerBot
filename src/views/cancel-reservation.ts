import { ObjectId } from "mongodb"
import { ReservedSeats } from "../models"
import { sendResponse } from "../utils/send-response";
import { Response } from "express";
import { cancelReservationResponses } from "../utils/response-messages";
import moment from "moment";

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
      const targetDate = moment(reservation.reservedFrom);
      // Get the current date as a Moment object
      const currentDate = moment();
      // Calculate the difference in days
      const daysDifference = targetDate.diff(currentDate, 'days');
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