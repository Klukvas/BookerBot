import {Schema, model} from 'mongoose'

// const allowedSeatTypes = process.env.ALLOWED_SEAT_TYPES?.split(' ') || ['Regual', 'Pro']

interface ISeat{
    seatNumber: number
    type: string
    cost: number
}

const seatSchema = new Schema<ISeat>({
    seatNumber: {
        type: Number, 
        required: true,
        unique: true
    },
    type: {
        type: String, 
        default: 'Regual'
    },
    cost: { type: Number, required: true }
});


const Seat = model<ISeat>('Seat', seatSchema);

export {Seat, ISeat}
