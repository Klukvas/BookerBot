import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Seat } from '../../models';

const mongod = MongoMemoryServer.create();

export const connectv2 = async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  const mongoConnection = (await mongoose.connect(uri)).connection;
  return {mongoConnection, mongod}
}

// export const connect = async () => {
//   const uri = (await mongod).getUri();
  
//   await mongoose.connect(uri);

//   return mongoose.connection;
// }

// export const closeDatabase = async () => {
//   await mongoose.connection.dropDatabase();
//   await mongoose.connection.close();
//   await (await mongod).stop();
// }

// export const clearDatabase = async () => {
//   const collections = mongoose.connection.collections;

//   for (const key in collections) {
//     const collection = collections[key];
//     await collection.deleteMany({});
//   }
// }

export const createSeats = async () => {
  const seats = [
    { name: 'Seat 1', type: 'Regular', cost: 100 },
    { name: 'Seat 2', type: 'Regular', cost: 100 },
    { name: 'Seat 3', type: 'Pro', cost: 250 },
  ];

  await Seat.create(seats);

  return seats;
}
