import moment from 'moment-timezone';
import {Document, Schema, model} from 'mongoose'

// const allowedSeatTypes = process.env.ALLOWED_SEAT_TYPES?.split(' ') || ['Regual', 'Pro']

interface ICondition extends Document {
  name: string
  isWeekend: boolean
  durationFrom: number
  duraionTo: number
  timeFrom: string
  timeTo: string
}

const promoSchema = new Schema<ICondition>({
    name: {type: String, required: true},
    isWeekend: {type: Boolean},
    durationFrom: {type: Number},
    duraionTo: {type: Number},
    timeFrom: {type: String},
    timeTo: {type: String}
});


const Condition = model<ICondition>('Conditions', promoSchema);

export {Condition, ICondition}
