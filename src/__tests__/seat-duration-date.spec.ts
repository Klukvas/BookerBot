import mongoose from "mongoose";
import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import App from "../utils/core/server";
import { ISeat } from "../models";
import { connectv2, createSeats } from "./core/db";
import { step1StartNewReservation } from "./interface/step-1-start-new-reservation";
import { step2ChooseSeatCommand } from "./interface/step2/step-2-choose-seat-command";
import { step2ChooseSeat } from "./interface/step2/step-2-choose-seat";
import { step3ChooseDurationCommand } from "./interface/step3/step-3-choose-duration-command";
import { step3ChooseDuration } from "./interface/step3/step-3-choose-duration";
import { step4ChooseDateCommand } from "./interface/step4/step-4-choose-date-command";
import { step4ChooseDate } from "./interface/step4/step-4-choose-date";
import { step5ApproveReservation } from "./interface/step-5-approve-reservation";

const app = new App().app;
const request = supertest(app);

describe('Seat-duration-date', () => {
  let seats: ISeat[]
  let testMongo: {mongoConnection: mongoose.Connection, mongod: MongoMemoryServer}

  beforeAll(async () => {
    testMongo = await connectv2()
    seats = await createSeats()
  });

  afterAll(async () => {
    await testMongo.mongoConnection.dropDatabase();
    await testMongo.mongoConnection.close();
    await testMongo.mongod.stop();
  });

  test('Positive case', async () => {
    await step1StartNewReservation({request})
    
    await step2ChooseSeatCommand({request, seats})
    await step2ChooseSeat({request, seats})

    await step3ChooseDurationCommand({request})
    await step3ChooseDuration({request})

    await step4ChooseDateCommand({request})
    await step4ChooseDate({request})

    await step5ApproveReservation({request})

  });

});
