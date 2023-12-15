import { Response } from "express";
import { Message } from "../../types/new-message";
import { logger } from "../../core/logger";
import { CreateUserIfNotExist } from "../CreateUserIfNotExist";
import { sendResponse } from "../../utils/send-response";
import { commandNames, responseMessages, startMessage } from "../../utils/response-messages";
import { activeReservations } from "../commands/active-reservations";
import { createReservation } from "../commands/create-reservation";
import { ReservedSeats } from "../../models";
import { step3 } from "../steps/step3";
import { step2 } from "../steps/step2";
import { step4 } from "../steps/step4";

type MessageHandlerArgs = {
  message: Message
  res: Response
}

export async function messageHandler({message, res}: MessageHandlerArgs) {
  const chatId = message.chat.id;
  if(!chatId){
    logger.error('Received message without chat id')
    res.status(200).send('ok')
    return
  }
  const user = await CreateUserIfNotExist(message);
  if(message?.text){
    await sendResponse({
      message: responseMessages.unknownMessage,
      expressResp: res,
      chatId: message.chat.id
    })
    return
  }

  switch (message.text){
    
    case commandNames.start:
      await sendResponse({
        chatId: message.chat.id,
        message: startMessage,
        expressResp: res
      })
      break;

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
        logger.info(`User: ${user.username} send value for step 2`)
        await step2({ message, user, res });
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