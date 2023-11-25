import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {Seat} from './models/seat';
import { CreateUserIfNotExist } from './views/CreateUserIfNotExist';
import { ReservedSeats } from './models';
import moment from 'moment';
import 'moment-timezone'; 
import { createSuggestion } from './views/createSuggestion';
import { responseMessages } from './utils/response-messages';
import { validateDuration } from './utils/validate-duration';
import { createReservation } from './views/commands/create-reservation';
import { chooseDuration } from './views/commands/choose-duration';
import { chooseSeat } from './views/commands/choose-seat';
import { step3 } from './views/steps/step3';
import { step2 } from './views/steps/step2';
import { chooseDate } from './views/commands/choose-date';
import { step4 } from './views/steps/step4';

moment.tz.setDefault('UTC');


dotenv.config();
const maxReservationsPerUser = Number(process.env.MAX_RESERVARION_PER_USER) || 2;
const maxReservationHours = Number(process.env.MAX_RESERVATION_HOURS) || 12
const app: Express = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});

//Mock
// (async () => {
//   let i = 0;
//   while(i < 14){
//     await Seat.create({
//       name: `SupaCool${Math.random() * (1000 - 10) + 10}`,
//       cost: Math.random() * (1000 - 10) + 10,
//       type: 'Regual'
//     })
//     i++  
//   }
  
// })()

mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`);

const db = mongoose.connection;


db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {console.log('Connected to MongoDB')});

app.post('/add-seat', async (req, res) => {
  const postData = req.body;
  try {
    const savedSeat = new Seat({
      name: postData.name,
      type: postData.type,
      cost: postData.cost
    })
    const error = savedSeat.validateSync()
    if(error){
        res.status(422).json({
          type: error.name,
          message: error.message
      })
      return
    }
    await savedSeat.save()
    res.status(201).send(savedSeat.toJSON())

  } catch (error: any) {
    console.error(`Error with saving new seat: ${error}`)
    res.status(500).json({
      message: error.message
    })
  }

});

app.delete('/delete-seat/:seatId', async (req: Request, res: Response) => {
  try {
    const seatId = req.params.seatId;
    const seat = await Seat.findById(seatId);

    if (!seat) {
      return res.status(404).json({
        error: `Could not find seat with id: ${seatId}`
      });
    }

    await seat.deleteOne();
    res.status(200).json({
      message: `Seat with id ${seatId} deleted successfully`
    });
  } catch (error) {
    console.error(`Error deleting seat: ${error}`);
    res.status(500).send('Some error on the server. Please try again later');
  }
});

app.get('/suggestion', async (req, res) => {
  const s = createSuggestion()
  res.send(s)
})

app.post('/new-message', async (req, res) => {
  const { message }  = req.body;
  const user = await CreateUserIfNotExist(message);
  const currentReservation = await ReservedSeats.findOne({user: user._id, reservationFinished: false})
  if(message.text == '/create-reservation'){
    await createReservation(user, {maxReservationsPerUser, res})
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
      return await step3({message: message.text, user, res})
   
      //step 2 in progress (/choose-seat)
    }else if(currentReservation.step == 2 && !currentReservation.stepFinished){
      await step2({message: message.text, user, res})

      //step 4 in progress (/choose-date)
    }else if(currentReservation.step == 4 && !currentReservation.stepFinished){
      await step4({message: message.text, user, res, currentReservation})
    }
  }


})
