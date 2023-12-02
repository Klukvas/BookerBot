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

export const createSeats = async () => {
  const seats = [
    { name: 'Seat 1', type: 'Regular', cost: 100 },
    { name: 'Seat 2', type: 'Regular', cost: 100 },
    { name: 'Seat 3', type: 'Pro', cost: 250 },
  ];

  await Seat.create(seats);

  return seats;
}
