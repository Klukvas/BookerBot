import { Response } from "express";
import { ReservedSeats } from "../../models";
import { IUser } from "../../models/user";

type ActiveReservationsArgs = {
    user: IUser
    res: Response
}

export async function activeReservations({user, res}: ActiveReservationsArgs) {
    const reservations = await ReservedSeats.find({user: user._id, reservationFinished: true})
    if(reservations.length >= 1){
        let textReservations = ''
        for(const item of reservations){
            textReservations += JSON.stringify( item.toJSON() )
        }
        res.send(`Вот все ваши активные резервации.\n${textReservations}`)
    }else{
        res.send(`У вас пока что нету активных резерваций. Что бы создать резервацию используйте команду /create-reservation`)
    }
    
}