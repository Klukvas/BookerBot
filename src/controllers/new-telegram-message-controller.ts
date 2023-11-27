import { Request, Response } from "express";
import { createReservation } from "../views/commands/create-reservation";
import { chooseDuration } from "../views/commands/choose-duration";
import { chooseSeat } from "../views/commands/choose-seat";
import { chooseDate } from "../views/commands/choose-date";
import { commandNames, responseMessages } from "../utils/response-messages";
import { ReservedSeats } from "../models";
import { CreateUserIfNotExist } from "../views/CreateUserIfNotExist";
import env from '../utils/core/env';
import { step3 } from "../views/steps/step3";
import { step2 } from "../views/steps/step2";
import { step4 } from "../views/steps/step4";
import { approveReservatiom } from "../views/commands/approve-reservation";
import { activeReservations } from "../views/commands/active-reservations";
import { sendResponse } from "../utils/send-response";

export async function newTelegramMessageController(req: Request, res: Response) {
  const { message }  = req.body;
    console.log('message: ', message)
    const user = await CreateUserIfNotExist(message);
    const currentReservation = await ReservedSeats.findOne({user: user._id, reservationFinished: false})
    if(message.text == commandNames.createReservation){
      await createReservation({user,res})
    }else if(message.text == commandNames.chooseDuration){
      await chooseDuration({currentReservation, user, res})
    }else if(message.text == commandNames.chooseSeat){
      await chooseSeat({user, currentReservation, res})
    }else if(message.text == commandNames.chooseDate){
      await chooseDate({user, currentReservation, res})
    }else if(message.text == commandNames.help){
      await sendResponse({chatId: message.chat.id, env, expressResp: res, message: responseMessages.help})
      // res.send(responseMessages.help)
    }else if(message.text == commandNames.approveReservation){
      await approveReservatiom({user, currentReservation, res})
    }else if(message.text == commandNames.activeReservations){
      await activeReservations({user, res})
    }else{
      const currentReservation = await ReservedSeats.findOne({user: user._id})
      if(!currentReservation){
        res.send(responseMessages.help)

        // step 3 in progress (/choose-duration)
      }else if (currentReservation.step == 3 && !currentReservation.stepFinished){
        return await step3({message: message.text, user, res, currentReservation})
      
        //step 2 in progress (/choose-seat)
      }else if(currentReservation.step == 2 && !currentReservation.stepFinished){
        await step2({message: message.text, user, res})

        //step 4 in progress (/choose-date)
      }else if(currentReservation.step == 4 && !currentReservation.stepFinished){
        await step4({message: message.text, user, res, currentReservation})
      }
    }
}