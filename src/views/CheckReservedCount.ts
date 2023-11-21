import { IReserved, ReservedSeats } from "../models";
import { IUser } from "../models/user";
import { ObjectId } from 'mongodb';


export async function CheckReservedCount(user: IUser): Promise<IReserved[]> {
    const currentReserv = await ReservedSeats.find({user: user})
    return currentReserv
}