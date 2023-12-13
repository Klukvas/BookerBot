import mongoose from "mongoose";
import env from "./env";
import { appLogger } from "./logger";


async function connectToDb() {
  appLogger.info(`db_url: ${env.dbUrl}`)
  await mongoose.connect(env.dbUrl)
  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', () => {console.log('Connected to MongoDB')});
}

export default connectToDb;