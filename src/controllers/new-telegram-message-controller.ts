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
import { approveReservatiom } from "../views/commands/approve-reservation";
import { activeReservations } from "../views/commands/active-reservations";
import { sendResponse } from "../utils/send-response";
import { Message } from "../types/new-message";

export async function newTelegramMessageController(req: Request, res: Response) {
  const { message }  = req.body;
  const chatId = message.chat.id;
  console.log('message: ', message);
  const user = await CreateUserIfNotExist(message);
  let currentReservation = await ReservedSeats.findOne({ user: user._id, reservationFinished: false });
  console.log('currentReservation: ', currentReservation)
  if(!message?.text){
    await sendResponse({
      message: responseMessages.unknownMessage,
      expressResp: res,
      chatId: message.chat.id
    })
    return
  }

  if (!currentReservation) {
    currentReservation = await ReservedSeats.create({
      user: user._id,
      step: 1,
      stepFinished: true,
    });
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
      await chooseDuration({ currentReservation, user, res, chatId });
      break;

    case commandNames.chooseSeat:
      await chooseSeat({ user, currentReservation, res, chatId });
      break;

    case commandNames.chooseDate:
      await chooseDate({ user, currentReservation, res, chatId });
      break;

    case commandNames.help:
      await sendResponse({ chatId , expressResp: res, message: responseMessages.help });
      break;

    case commandNames.approveReservation:
      await approveReservatiom({ user, currentReservation, res, chatId });
      break;

    case commandNames.activeReservations:
      await activeReservations({ user, res, chatId });
      break;

    default:
      if (currentReservation.step == 3 && !currentReservation.stepFinished) {
        await step3({ message , user, res, currentReservation });
      } else if (currentReservation.step == 2 && !currentReservation.stepFinished) {
        await step2({ message, user, res });
      } else if (currentReservation.step == 4 && !currentReservation.stepFinished) {
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
