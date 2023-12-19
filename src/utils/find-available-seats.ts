import moment from "moment"
import { IReserved, ISeat, ReservedSeats, Seat } from "../models"

type CrateSeatSuggestionArgs = {
    currentReservation: IReserved
}

export async function findAvailableSeats(args: CrateSeatSuggestionArgs):Promise<ISeat[]> {
  const { currentReservation } = args
  const availableSeats = [];
  
  const requestFrom = currentReservation.reservedFrom
  const requestTo = currentReservation.reservedTo

  const allSeats = await Seat.find({})
  for(const seat of allSeats){
    const reservationsBySeat = await ReservedSeats.find({
      seatId: seat._id,
      reservedFrom: {$gte: requestFrom},
      reservedTo: {$lte: requestTo}
    })
    if(reservationsBySeat.length == 0){
      availableSeats.push(seat)
    }
    
  }

  return availableSeats
    
}