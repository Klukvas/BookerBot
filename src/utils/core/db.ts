import mongoose from "mongoose";
import env from "./env";


async function connectToDb() {
  await mongoose.connect(`${env.dbUrl}/${env.dbName}`)
  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', () => {console.log('Connected to MongoDB')});
}

export default connectToDb;