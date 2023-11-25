import { Response } from "express";
import { IReserved, ReservedSeats, Seat } from "../../models";
import { IUser } from "../../models/user";
import { createSuggestion } from "../suggestions/create-suggestion";
import { findAvailableSeats } from "../../utils/find-available-seats";
import { responseMessages } from "../../utils/response-messages";


type ChooseSeatArgs = {
  currentReservation: IReserved | null;
  user: IUser;
  res: Response;
};

export async function chooseSeat(args: ChooseSeatArgs) {
  const { currentReservation, user, res } = args;
  let allSeats = await Seat.find({});

  try {
    if (!currentReservation) {
      await ReservedSeats.create({ user: user._id, step: 2, stepFinished: false });
      res.status(200).send(`Отлично! Давайте выберем место. Вот список всех мест:\n${allSeats}`);
    } else if (currentReservation.step === 3 && !currentReservation.stepFinished) {
      res.status(400).send('Видимо, вы ошиблись. Ожидалось, что вы введете продолжительность');
    } else if (currentReservation.step === 4 && !currentReservation.stepFinished) {
      res.status(400).send('Видимо, вы ошиблись. Ожидалось, что вы введете дату');
    } else {
      //If we have reservedFrom and reservedTo values - we could say which seats available for the user
      if(currentReservation.reservedFrom && currentReservation.reservedTo){
       const foundAvailableSeats = await findAvailableSeats({currentReservation})
       console.log('foundAvailableSeats: ', foundAvailableSeats)
       console.log('wtf')
       if(foundAvailableSeats.length >= 1){
          console.log('here')
          await ReservedSeats.updateOne(
            { user: user._id },
            { $set: { step: 2, stepFinished: false } }
          );
          res.status(200).send(`Отлично! Давайте выберем место. Вот список всех мест:\n${foundAvailableSeats}`);
        }else{
          //Todo: here should be suggestion
          await ReservedSeats.deleteOne({ user: user._id,  reservationFinished: false})
          res.status(400).send(responseMessages.failTryAgain)
        }
      }else{
        await ReservedSeats.updateOne(
          { user: user._id },
          { $set: { step: 2, stepFinished: false } }
        );
        res.status(200).send(`Отлично! Давайте выберем место. Вот список всех мест:\n${allSeats}`);
      }
      
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Произошла ошибка при обработке запроса.');
  }
}
