import {Schema, model} from 'mongoose'

// const allowedSeatTypes = process.env.ALLOWED_SEAT_TYPES?.split(' ') || ['Regual', 'Pro']

interface ISeat{
    name: string
    type: string
    cost: number
}

const seatSchema = new Schema<ISeat>({
    name: {
        type: String, 
        required: true,
    },
    type: {
        type: String, 
        default: 'Regual'
    },
    cost: { type: Number, required: true }
});


const Seat = model<ISeat>('Seat', seatSchema);

export {Seat, ISeat}
