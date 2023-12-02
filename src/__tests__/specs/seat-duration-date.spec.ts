import supertest from "supertest";
import App from "../../utils/core/server";
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from "mongoose";
import { step1StartNewReservation } from "../interface/step-1-start-new-reservation";
import { step2ChooseSeatCommand } from "../interface/step2/step-2-choose-seat-command";
import { step2ChooseSeat } from "../interface/step2/step-2-choose-seat";
import { step3ChooseDurationCommand } from "../interface/step3/step-3-choose-duration-command";
import { step3ChooseDuration } from "../interface/step3/step-3-choose-duration";
import { step4ChooseDateCommand } from "../interface/step4/step-4-choose-date-command";
import { step4ChooseDate } from "../interface/step4/step-4-choose-date";
import { step5ApproveReservation } from "../interface/step-5-approve-reservation";
import { createSeats } from "../core/db";
import { ISeat } from "../../models";
import { sendRequestToBot } from "../infra/send-request-to-bot";
import {expect, jest, test} from '@jest/globals';


const app = new App().app
const request = supertest(app)


describe("seat-duration-date", () => {
  let mongod: MongoMemoryServer;
  let seats: ISeat[]
  beforeAll(async () => {
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri)
      seats = await createSeats()
  })
  afterAll(async () => {
      await mongod.stop()
  })
  
  it("positive case", async () => {
    await step1StartNewReservation({request})
      
    //   await step2ChooseSeatCommand({request, seats, mockedAxios})
    //   await step2ChooseSeat({request, seats, mockedAxios})
      

    //   await step3ChooseDurationCommand({request})
    //   await step3ChooseDuration({request})

    //   await step4ChooseDateCommand({request})
    //   await step4ChooseDate({request})

    //   await step5ApproveReservation({request})
  });
});