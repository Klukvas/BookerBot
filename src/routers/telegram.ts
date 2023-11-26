import express, { Request, Response, Router } from 'express'
import { CreateUserIfNotExist } from '../views/CreateUserIfNotExist';
import { ReservedSeats } from '../models';
import { createReservation } from '../views/commands/create-reservation';
import { chooseDuration } from '../views/commands/choose-duration';
import { chooseSeat } from '../views/commands/choose-seat';
import { chooseDate } from '../views/commands/choose-date';
import { responseMessages } from '../utils/response-messages';
import { step3 } from '../views/steps/step3';
import { step2 } from '../views/steps/step2';
import { step4 } from '../views/steps/step4';
import env from '../utils/core/env';

class Telegram{
  public router: Router
  public env: typeof env
  constructor(){
      this.router = express.Router()
      this.router.post('/new-message', this.newMessageHandler)
      this.env = env
  }
  async newMessageHandler(req: Request, res: Response){
    const { message }  = req.body;
    const user = await CreateUserIfNotExist(message);
    const currentReservation = await ReservedSeats.findOne({user: user._id, reservationFinished: false})
    if(message.text == '/create-reservation'){
      await createReservation(user, {maxReservationsPerUser: env.maxReservationPerUser, res})
    }else if(message.text == '/choose-duration'){
      await chooseDuration({currentReservation, user, res})
    }else if(message.text == '/choose-seat'){
      await chooseSeat({user, currentReservation, res})
    }else if(message.text == '/choose-date'){
      await chooseDate({user, currentReservation, res})
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
}

export default new Telegram().router;
