import { ReservedSeats } from "../../models"
import { IUser } from "../../models/user"
import { buildResponse } from "../../utils/response"

type CreateReservationCommandArgs = {
    maxReservationsPerUser?: number
}

export async function handleCreateReservationCommand(user: IUser, args: CreateReservationCommandArgs = {}) {
    const { maxReservationsPerUser = 2} = args
    // remove expired reservation
    await ReservedSeats.deleteMany({user: user._id, reservedTo: { $lte: new Date()}, reserationFinished: true })
    // get all "active" reservation
    const finishedReservation = await ReservedSeats.find({user: user._id, reserationFinished: true})
    console.log('finishedReservation: ', finishedReservation)
    //user cound not have more than X active reservation
    if(finishedReservation.length >= maxReservationsPerUser){
        return buildResponse({status: 400, responseMessage: 'Too many reservation'})
    }
    // could be only 1 reservationInProgress
    const reservationInProgress = await ReservedSeats.findOne({user: user._id, reserationFinished: false})
    console.log('reservationInProgress: ', reservationInProgress)
    // if we already have 1 reservation in progress -> delete it and create a new one
    reservationInProgress ?
      await ReservedSeats.deleteOne({_id: reservationInProgress})
      :
      await ReservedSeats.create({
        user: user,
      })
      return buildResponse({status: 200, responseMessage: 'Okay, lets create a new reservation. First of all - lets pick date and time. Example: 01.12.2023 12:50'})
    
}