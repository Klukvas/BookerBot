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
import { nextStepMessages, step2Responses, step3Responses, step4Responses } from "../../utils/response-messages";
import { sendUserResponseToBot } from "../interface/send-user-response-to-bot";
import { getTommorowDate } from "../infra/get-tommorow-date";



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
      
    await step3ChooseDurationCommand({request})
    const expectedStep3Response = [
      step3Responses.success,
      nextStepMessages.pickDate,
      nextStepMessages.pickSeat
    ]
    await sendUserResponseToBot({request, expectedTextList: expectedStep3Response, userMessage: "2:00"})

    await step2ChooseSeatCommand({request, seats})
    const expectedStep2Response = [
      step2Responses.success,
      nextStepMessages.pickDate,
    ]
    await sendUserResponseToBot({request, expectedTextList: expectedStep2Response, userMessage: seats[0].name})

    await step4ChooseDateCommand({request})
    const expectedStep4Response = [
      step4Responses.success,
      nextStepMessages.noStepsLeft,
    ]
    await sendUserResponseToBot({request, expectedTextList: expectedStep4Response, userMessage: getTommorowDate()})

    await step5ApproveReservation({request})
  });
});