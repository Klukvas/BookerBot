import mongoose from "mongoose";
import env from "./env";
import { appLogger } from "./logger";


async function connectToDb() {
  const db_url = `${env.dbUrl}/${env.dbName}`
  appLogger.info(`db_url: ${db_url}`)
  await mongoose.connect(db_url)
  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', () => {console.log('Connected to MongoDB')});
}

export default connectToDb;