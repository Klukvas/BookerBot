import {Document, Schema, model} from 'mongoose'

// const allowedSeatTypes = process.env.ALLOWED_SEAT_TYPES?.split(' ') || ['Regual', 'Pro']

interface IPromoType extends Document {
  name: string
  desciption: string
}

const IPromoTypeSchema = new Schema<IPromoType>({
    name: {
        type: String, 
        required: true,
        unique: true
    },
    desciption: {
        type: String,
        required: true,
    },
});


const PromoType = model<IPromoType>('PromoType', IPromoTypeSchema);

export {PromoType, IPromoType}
