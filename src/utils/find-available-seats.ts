import moment from "moment"
import { IReserved, ISeat, ReservedSeats, Seat } from "../models"
import { addDurationToDate } from "./add-duration-to-date"

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
    console.log('requestFrom: ', requestFrom)
    console.log('requestTo: ', requestTo)
    console.log('reservationsBySeat: ', reservationsBySeat)
    console.log('reservationsBySeat.length: ', reservationsBySeat.length)

    if(reservationsBySeat.length == 0){
      availableSeats.push(seat)
    }
    
  }

  console.log('availableSeats: ', availableSeats)

  return availableSeats
    
}