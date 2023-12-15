import { logger } from "../core/logger";
import { IReserved, ReservedSeats } from "../models";
import { IUser, User } from "../models/user";

type CreateReservationIfNotExistArgs = {
  step: 1 | 2 | 3 | 4
  user: IUser
  stepFinished?: boolean
}

type CreateReservationIfNotExistResult = {
  reservation: IReserved
  isNew: boolean
}

export async function createReservationIfNotExist(
  {
    step, 
    user, 
    stepFinished = false,
  }: CreateReservationIfNotExistArgs
): Promise<CreateReservationIfNotExistResult>{
  
  let reservation = await ReservedSeats.findOne({user: user._id, reservationFinished: false})
  let isNew = false
  if(!reservation){
    logger.info(`Reservation is not exist for user: ${user.username} -> creating`)
    reservation = await ReservedSeats.create({
      user: user._id,
      step: step,
      stepFinished: stepFinished,
    });
    isNew = true
  }
    return { reservation, isNew }
}