import { IReserved, ISeat, ReservedSeats, Seat } from "../../models"

export async function findAvailableSeats(reservedSeat: IReserved): Promise<ISeat[]> {
    const allReservedSeats: IReserved[] = await ReservedSeats.find({
        reservedFrom: { $lte: reservedSeat.reservedFrom },
        reservedTo: { $gte: reservedSeat.reservedTo }
    }).exec()

    const arrayOfSeatIds = allReservedSeats
        .filter(reserved => reserved.seatId) 
        .map(reserved => reserved.seatId)

    const availableSeats = await Seat.find({ _id: { $nin: arrayOfSeatIds } }).exec()

    return availableSeats
}
