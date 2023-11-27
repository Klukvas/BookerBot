import { Response } from "express";
import { IReserved, ReservedSeats } from "../../models";
import { IUser } from "../../models/user";
import { responseMessages } from "../../utils/response-messages";

type ApproveReservationArgs = {
  currentReservation: IReserved | null;
  user: IUser;
  res: Response;
};

export async function approveReservatiom({currentReservation, user, res}: ApproveReservationArgs) {
  if(!currentReservation){
    res.send(responseMessages.reservationNotFound)
  }else{
    // check if time is not taken
    const sameReservations = await ReservedSeats.find({
      user: {$ne: currentReservation.user},
      reservedFrom: {$gte: currentReservation.reservedFrom}, 
      reservedTo: {$lte: currentReservation.reservedTo}, 
      seatId: currentReservation.seatId,
      reservationFinished: true
    })
    if(sameReservations.length !== 0){
      await ReservedSeats.deleteOne({_id: currentReservation._id})
      res.send(responseMessages.sameReservationFinished)
    }else{
      await ReservedSeats.updateOne({_id: currentReservation._id}, {$set: {reservationFinished: true}})
      res.send(responseMessages.reservationFinished)
    }

  }

    
}