import { Response } from "express";
import { ReservedSeats } from "../../models";
import { sendResponse } from "../../utils/send-response";
import { cancelReservationResponses } from "../../utils/response-messages";
import { reservationFormatterBot } from "../../utils/formatters/reservation-formatter-bot";
import { getReservationKeyboard } from "../../utils/get-reservation-keyboard";
import { DefaultCommandProcessArgs } from "../../types/default-command-process-args";

export async function cancelReservationCommand({user, res, chatId}: DefaultCommandProcessArgs) {
  const userReservations = await ReservedSeats.find({user: user._id})
  if(userReservations){
      const reservationList = [];
      let formattedReservations = ''; 
      for (let i = 0; i <= userReservations.length - 1; i++) {
        const reservationStringData = await reservationFormatterBot([userReservations[i]], `айди: ${i}\n`)
        formattedReservations += reservationStringData
        reservationList.push({id: i, reservation: userReservations[i]})
      }
      const keyboard = await getReservationKeyboard({reservations: reservationList})
      await sendResponse({
        expressResp: res,
        chatId: chatId,
        message: formattedReservations,
        reply_markup: keyboard
      })

  }else{
    await sendResponse({
      expressResp: res,
      chatId,
      message: cancelReservationResponses.reservationsNotFound
    })
  }

}