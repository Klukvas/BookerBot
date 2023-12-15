import { logger } from "../core/logger";
import { IReserved, ReservedSeats } from "../models";
import { IUser } from "../models/user";

type CreateReservationIfNotExistArgs = {
  step: 1 | 2 | 3 | 4
  user: IUser
  stepFinished?: boolean
  existingReservation?: IReserved 
}

export async function createReservationIfNotExist(
  {
    step, 
    user, 
    stepFinished = false,
    existingReservation
  }: CreateReservationIfNotExistArgs
): Promise<IReserved>{
  if(!existingReservation){
    logger.info(`Reservation is not exist for user: ${user.username} -> creating`)
    const reservation = await ReservedSeats.create({
      user: user._id,
      step: step,
      stepFinished: true,
    });
    return reservation
  }
  logger.info(`Reservation exists for user: ${user.username}`)
  return existingReservation
}