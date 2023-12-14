import { Request, Response } from "express";
import { createReservation } from "../views/commands/create-reservation";
import { chooseDuration } from "../views/commands/choose-duration";
import { chooseSeat } from "../views/commands/choose-seat";
import { chooseDate } from "../views/commands/choose-date";
import { commandNames, responseMessages, startMessage } from "../utils/response-messages";
import { ReservedSeats } from "../models";
import { CreateUserIfNotExist } from "../views/CreateUserIfNotExist";
import { step3 } from "../views/steps/step3";
import { step2 } from "../views/steps/step2";
import { step4 } from "../views/steps/step4";
import { approveReservation } from "../views/commands/approve-reservation";
import { activeReservations } from "../views/commands/active-reservations";
import { sendResponse } from "../utils/send-response";
import { Message } from "../types/new-message";
import { appLogger } from "../core/logger";
import { createReservationIfNotExist } from "../views/create-reservation-if-not-exist";

export async function newTelegramMessageController(req: Request, res: Response) {
  const { message, edited_message }  = req.body;
  if(edited_message) {
    res.status(200).send('ok')
    return
  }
  appLogger.info(`message: ${JSON.stringify(message)}`)
  const chatId = message?.chat?.id;
  const user = await CreateUserIfNotExist(message);
  let currentReservation = await ReservedSeats.findOne({ user: user._id, reservationFinished: false });
  if(!message?.text){
    await sendResponse({
      message: responseMessages.unknownMessage,
      expressResp: res,
      chatId: message.chat.id
    })
    return
  }
  switch (message.text) {

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

    case commandNames.chooseDuration:
      await createReservationIfNotExist({user, step: 3})
      await chooseDuration({ currentReservation, user, res, chatId });
      break;

    case commandNames.chooseSeat:
      await createReservationIfNotExist({user, step: 2})
      await chooseSeat({ user, currentReservation, res, chatId });
      break;

    case commandNames.chooseDate:
      await createReservationIfNotExist({user, step: 4})
      await chooseDate({ user, currentReservation, res, chatId });
      break;

    case commandNames.help:
      await sendResponse({ chatId , expressResp: res, message: responseMessages.help });
      break;

    case commandNames.approveReservation:
      await approveReservation({ user, currentReservation, res, chatId });
      break;

    case commandNames.activeReservations:
      await activeReservations({ user, res, chatId });
      break;

    default:
      if (currentReservation?.step == 3 && !currentReservation.stepFinished) {
        await step3({ message , user, res, currentReservation });
      } else if (currentReservation?.step == 2 && !currentReservation.stepFinished) {
        await step2({ message, user, res });
      } else if (currentReservation?.step == 4 && !currentReservation.stepFinished) {
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
