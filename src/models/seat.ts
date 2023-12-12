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
        required: true,
        default: 'Regual'
    },
    cost: { type: Number, required: true }
});

seatSchema.pre('validate', function(next){
    if(typeof(this.name) !== 'string'){
        next(new Error('Name should be a string value'))
    }
    // else if(!allowedSeatTypes.includes(this.type) || typeof(this.type) !== 'string'){
    //     next(new Error(`Type field should be on of [${allowedSeatTypes}]`))
    // }
    else if(typeof(this.cost) != 'number'){
        next(new Error('Cost field should be a number'))
    }
    else{
        next()
    }
})

const Seat = model<ISeat>('Seat', seatSchema);

export {Seat, ISeat}
