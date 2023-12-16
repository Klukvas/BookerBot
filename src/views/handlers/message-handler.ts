import { Response } from "express";
import { Message } from "../../types/new-message";
import { logger } from "../../core/logger";
import { CreateUserIfNotExist } from "../CreateUserIfNotExist";
import { sendResponse } from "../../utils/send-response";
import { commandNames, expectAnoutherValue, responseMessages, startMessage } from "../../utils/response-messages";
import { activeReservations } from "../commands/active-reservations";
import { createReservation } from "../commands/create-reservation";
import { ReservedSeats } from "../../models";
import { step3 } from "../steps/step3";
import { step2 } from "../steps/step2";
import { step4 } from "../steps/step4";
import { cancelReservationCommand } from "../commands/cancel-resercation-command";

type MessageHandlerArgs = {
  message: Message
  res: Response
}

export async function messageHandler({message, res}: MessageHandlerArgs) {
  const chatId = message.chat.id;
  const user = await CreateUserIfNotExist(message);

  switch (message?.text){
    
    case undefined:
      await sendResponse({
        message: responseMessages.unknownMessage,
        expressResp: res,
        chatId: message.chat.id
      })
      break;
    
    case commandNames.start:
      await sendResponse({
        chatId: message.chat.id,
        message: startMessage,
        expressResp: res
      })
      break;
    
    case commandNames.cancelReservation:
      await cancelReservationCommand({ user, res, chatId })
    
    case commandNames.createReservation:
      await createReservation({ user, res, chatId });
      break;

    case commandNames.help:
      await sendResponse({ chatId , expressResp: res, message: responseMessages.help });
      break;

    case commandNames.activeReservations:
      await activeReservations({ user, res, chatId });
      break;

    default:
      let currentReservation = await ReservedSeats.findOne({ user: user._id, reservationFinished: false });
      if (currentReservation?.step == 3 && !currentReservation.stepFinished) {
        logger.info(`User: ${user.username} send value for step 3`)
        await step3({ message , user, res, currentReservation });
      } else if (currentReservation?.step == 2 && !currentReservation.stepFinished) {
        // we are using btns to select seat -> so here we just notify user that  we a waiting for btn to be pressed
        await sendResponse({
          message: expectAnoutherValue.expectSeat,
          expressResp: res,
          chatId
        })
        // logger.info(`User: ${user.username} send value for step 2`)
        // await step2({ message, user, res });
      } else if (currentReservation?.step == 4 && !currentReservation.stepFinished) {
        logger.info(`User: ${user.username} send value for step 4`)
        await step4({ message, user, res, currentReservation });
      }else{
        await sendResponse({
          message: responseMessages.unknownMessage,
          expressResp: res,
          chatId: message.chat.id
        })
      }
      break;
  }
  
}