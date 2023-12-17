import supertest from "supertest";
import App from "../../../core/server";
import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';
import { step1StartNewReservation } from "../../interface/step-1-start-new-reservation";
import { step2ChooseSeatCommand } from "../../interface/step2/step-2-choose-seat-command";
import { step3ChooseDurationCommand } from "../../interface/step3/step-3-choose-duration-command";
import { step4ChooseDateCommand } from "../../interface/step4/step-4-choose-date-command";
import { step5ApproveReservation } from "../../interface/step-5-approve-reservation";
import { createSeats } from "../../core/db";
import { ISeat } from "../../../models";
import { nextStepMessages, step2Responses, step3Responses, step4Responses } from "../../../utils/response-messages";
import { sendUserResponseToBot } from "../../interface/send-user-response-to-bot";
import { addDaysToCurrentDay } from "../../infra/add-days-to-current-day";
import moment from "moment-timezone";


moment.tz.setDefault('UTC');
const app = new App().app
const request = supertest(app)


describe("Core integration cases", () => {
  let mongod: MongoMemoryServer;
  let seats: ISeat[]
  
  beforeAll(async () => {
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri)
      seats = await createSeats()
  })

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase()
    seats = await createSeats()
  })

  afterAll(async () => {
    await mongoose.connection.destroy()
    await mongod.stop()
  })
  
  it('Date more then 7 days from today', async () => {
    await step1StartNewReservation({request})
    
    await step4ChooseDateCommand({request})
    const expectedStep4Response = [
      step4Responses.dateTooFarInFuture
    ]
    await sendUserResponseToBot({request, expectedTextList: expectedStep4Response, userMessage: addDaysToCurrentDay(9)})
  })
  it('Date with 31 minutes', async () => {
    await step1StartNewReservation({request})
    
    await step4ChooseDateCommand({request})
    await sendUserResponseToBot({request, expectedText: step4Responses.invalidMinutes.trim(), userMessage: addDaysToCurrentDay(7, 12, 31)})
  })
  it('Date exceeded the close date ', async () => {
    await step1StartNewReservation({request})
    
    await step4ChooseDateCommand({request})
    await sendUserResponseToBot({request, expectedText: step4Responses.closeTimeExceeded.trim(), userMessage: addDaysToCurrentDay(7, 20, 30)})
  })

});