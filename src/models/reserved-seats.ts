import mongoose, { Document, Schema } from 'mongoose';

interface IReserved extends Document {

  reservedFrom: Date
  reservedTo: Date
  reservedFor: number

  seatId: mongoose.Schema.Types.ObjectId
  user: mongoose.Schema.Types.ObjectId
  step: number

  reserationFinished: boolean
}
const ReservedSeatsSchema = new mongoose.Schema<IReserved>({
  
  reservedFrom: { type: Date },
  reservedTo: { type: Date },
  reservedFor: { type: Number },

  seatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  step: { type: Number, default: 1 },
  reserationFinished: {type: Boolean, default: false}

});

const ReservedSeats = mongoose.model<IReserved>('ReservedSeats', ReservedSeatsSchema);


export { ReservedSeats, IReserved};
