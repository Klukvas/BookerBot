import moment from 'moment-timezone';
import {Document, Schema, model} from 'mongoose'

// const allowedSeatTypes = process.env.ALLOWED_SEAT_TYPES?.split(' ') || ['Regual', 'Pro']

interface IPromo extends Document {
  name: string
  typeId: Schema.Types.ObjectId[]
  conditions: Schema.Types.ObjectId[]
}

const promoSchema = new Schema<IPromo>({
    name: {
        type: String, 
        required: true,
        unique: true
    },
    typeId: [{
      type: Schema.Types.ObjectId,
      ref: 'PromoType'
    }],
    conditions: [{
      type: Schema.Types.ObjectId,
      ref: 'Conditions'
    }]

});


const Promo = model<IPromo>('Promo', promoSchema);

export {Promo, IPromo}
