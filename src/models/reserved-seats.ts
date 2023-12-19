import mongoose, { Document, Schema } from 'mongoose';
import { User } from './user';

interface IReserved extends Document {

  startAt: Date

  reservedFrom: Date
  reservedTo: Date
  duration: number

  seatId: mongoose.Schema.Types.ObjectId
  userId: mongoose.Schema.Types.ObjectId

  totalAmountToPay: number

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
  duration: { type: Number },

  totalAmountToPay: {type: Number},

  seatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  
  step: { type: Number, default: 1 },
  stepFinished: { type: Boolean, default: false },

  reservationFinished: { type: Boolean, default: false },
});

ReservedSeatsSchema.set('timestamps', false);

ReservedSeatsSchema.pre('save', async function (next) {
  try {
    // Find the associated user based on the logic in your application
    const user = await User.findOneAndUpdate(
      { _id: this.userId },
      { $addToSet: { reservations: this._id } },
      { new: true }
    );

    if (!user) {
      // Handle the case where the associated user is not found
      console.error('Associated user not found for reservation:', this._id);
    }
  } catch (error) {
    // Handle errors, such as database errors
    console.error('Error updating user reservations:', error);
  }

  next();
});

ReservedSeatsSchema.pre('deleteOne', { document: true }, async function (next) {
  try {
    const user = await User.findOneAndUpdate(
      { _id: this.userId },
      { $pull: { reservations: this._id } },
      { new: true }
    );

    if (!user) {
      // Handle the case where the associated user is not found
      console.error('Associated user not found for reservation:', this._id);
    }
  } catch (error) {
    // Handle errors, such as database errors
    console.error('Error updating user reservations:', error);
  }

  next();
});



const ReservedSeats = mongoose.model<IReserved>('ReservedSeats', ReservedSeatsSchema);


export { ReservedSeats, IReserved};
