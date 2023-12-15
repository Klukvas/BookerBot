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
    const reservation = await ReservedSeats.create({
      user: user._id,
      step: step,
      stepFinished: true,
    });
    return reservation
  }
  return existingReservation
}