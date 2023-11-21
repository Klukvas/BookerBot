import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  username?: string;
  chatId: number;
  userId: number;
  lastName?: string;
  first_name?: string;
  reserveds: Schema.Types.ObjectId[]
}

const userSchema = new Schema<IUser>({
  username: { type: String },
  userId: {
    type: Number,
    required: true,
    index: {
      unique: true,
    },
  },
  chatId: {
    type: Number,
    required: true,
    index: {
      unique: true,
    },
  },
  lastName: { type: String },
  first_name: { type: String },
  reserveds: [{
    type: Schema.Types.ObjectId,
    ref: 'ReservedSeats'
  }]
});

const User = model<IUser>('User', userSchema);

export {User, IUser};
