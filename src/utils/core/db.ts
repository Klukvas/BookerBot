import mongoose from "mongoose";


async function connectToDb() {
  await mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`)
  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', () => {console.log('Connected to MongoDB')});
}

export default connectToDb;