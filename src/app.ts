import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {Seat} from './models/seat';
import { CreateUserIfNotExist } from './views/CreateUserIfNotExist';
import { ReservedSeats } from './models';
import { CheckReservedCount } from './views/CheckReservedCount';
import { IUser } from './models/user';
import { Message } from './types/new-message';
import moment from 'moment';
import 'moment-timezone'; 
import { findAvailableSeats } from './views/create-reservation/find-available-seats';
import { handleCreateReservationCommand } from './views/create-reservation/handle-create-reservation-command';
import { reservationStep1 } from './views/create-reservation/reservation-step-1';
import { createSuggestion } from './views/createSuggestion';

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

// //Mock
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
  let user;
  let responseMessage = '';
  const { message }  = req.body;

  try {
    user = await CreateUserIfNotExist(message);
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).send('Error creating user');
  }
  // user want to start a new reservation process
  if(message.text == '/create-reservation'){
    const result = await handleCreateReservationCommand(user)
    if(result.sendResponse) res.status(result.responseData.status).send(result.responseData.responseMessage)
  }
    try {
      // check if user has reservarion in progress
      // if he is - that means that he is in his way to reserve the seat
      const reservationInProgress = await ReservedSeats.findOne({user: user._id, reserationFinished: false})
      
      if(reservationInProgress){
        // on step 1 we expect date time from user
        if(reservationInProgress.step == 1){
          const step1Result = await reservationStep1(message.text, reservationInProgress)
          if(step1Result.sendResponse) res.status(step1Result.responseData.status).send(step1Result.responseData.responseMessage)
        }else if(reservationInProgress.step == 2){
          let hours;
          try{
            hours = Number(message.text)
          }catch(error){
            res.send('Wrong format. Just type any number.\nExample: 5')
          }
          if(hours){
            if(hours > maxReservationHours){
              res.send('Sorry, but for now, nax hours is 12')
              return
            }
            let reservedSeat = await ReservedSeats.findOne({_id: reservationInProgress._id})
            console.log('reservedSeat: ', reservedSeat!.reservedFrom)
            console.log('reservedSeat: ', typeof(reservedSeat!.reservedFrom))
            const reservedTo = moment(reservedSeat!.reservedFrom).tz('UTC').add(hours, 'hours')
            await ReservedSeats.updateOne(
              { _id: reservationInProgress._id }, 
              { $set: { step: 3, reservedFor: hours, reservedTo: reservedTo} }
            )
            
            reservedSeat = await ReservedSeats.findOne({_id: reservationInProgress._id})
            //TODO: Need to understand with seat is awailable
            const awailableSeats = await findAvailableSeats(reservedSeat!)
            if(awailableSeats){
              let prettyAwailableSeats = ""
              for(const seat of awailableSeats){
                prettyAwailableSeats += `Name: ${seat.name}\t Type: ${seat.type}\n\n`
              }
              res.status(200).send(`Great. Now U could pick a place(U clould skip it). Awailable seats:\n ${prettyAwailableSeats}`)
              return
            }else{
              await ReservedSeats.findOneAndDelete({_id: reservationInProgress._id})
              
              res.send('Cound not find any free seat. Try anouther date and time')
            }
            
          }
          res.send('Wrong format. Just type any number.\nExample: 5')
        }else if(reservationInProgress.step == 3){
          const seatName = message.text
          if(seatName !== 'skip'){
            const seat = await Seat.findOne({name: seatName})
            if(seat){
              await ReservedSeats.updateOne({ _id: reservationInProgress._id }, { $set: { seatId: seat._id, reserationFinished: true} })
              const finishedReservation = await ReservedSeats.findOne({ _id: reservationInProgress._id })
              res.send(`Awesome. U now have new reservation: ${finishedReservation}`)
              return
            }else{
              res.send('It is not valid. Use skip to skip place selecting or use name to select the seat')
              return
            }

          }else{
            await ReservedSeats.updateOne({ _id: reservationInProgress._id }, { $set: { reserationFinished: true } })
            const finishedReservation = await ReservedSeats.findOne({ _id: reservationInProgress._id })
            console.log('finishedReservation: ', finishedReservation)
            res.status(200).json(finishedReservation)
            return
          }
        }
      }
      
    } catch (error) {
      console.error('Error checking reserved seats:', error);
      res.status(500).send('Error getting reserved seats');
    }







  
  
});

