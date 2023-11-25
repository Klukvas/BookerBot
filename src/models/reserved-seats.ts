import mongoose, { Document, Schema } from 'mongoose';

interface IReserved extends Document {

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
  
  reservedFrom: { type: Date },
  reservedTo: { type: Date },
  duration: { type: String },

  seatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  step: { type: Number, default: 1 },
  stepFinished: {type: Boolean, default: false},

  reservationFinished: {type: Boolean, default: false}

});
// ReservedSeatsSchema.pre('updateOne', async function(next) {
//   // Check if the update includes the 'step' field
//   const data = this.getUpdate() as { $set?: any };
  
//   // console.log('data: ', data)
//   const setVal = data?.$set ?? null;

//   // Check if the update includes the 'step' field
//   console.log('setVal.stepFinished: ', setVal.stepFinished)
//   if (setVal && setVal.step !== undefined && setVal.stepFinished == undefined) {
//     // Set 'stepFinished' to false
//     setVal.stepFinished = false;
//   }

//   next();
// });



const ReservedSeats = mongoose.model<IReserved>('ReservedSeats', ReservedSeatsSchema);


export { ReservedSeats, IReserved};
