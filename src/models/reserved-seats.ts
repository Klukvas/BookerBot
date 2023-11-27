import mongoose, { Document, Schema } from 'mongoose';

interface IReserved extends Document {

  startAt: Date

  reservedFrom: Date
  reservedTo: Date
  duration: string

  seatId: mongoose.Schema.Types.ObjectId
  user: mongoose.Schema.Types.ObjectId

  step: number
  stepFinished: boolean

  reservationFinished: boolean
}
const ReservedSeatsSchema = new mongoose.Schema<IReserved>({
  startAt: { type: Date, default: Date.now },

  reservedFrom: {
    type: Date,
    validate: {
      validator: function (value: any) {
        return value instanceof Date;
      },
      message: 'Invalid date for reservedFrom',
    },
  },
  reservedTo: {
    type: Date,
    validate: {
      validator: function (value: any) {
        return value instanceof Date;
      },
      message: 'Invalid date for reservedTo',
    },
  },
  duration: { type: String },

  seatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  
  step: { type: Number, default: 1 },
  stepFinished: { type: Boolean, default: false },

  reservationFinished: { type: Boolean, default: false },
});

const ReservedSeats = mongoose.model<IReserved>('ReservedSeats', ReservedSeatsSchema);


export { ReservedSeats, IReserved};
