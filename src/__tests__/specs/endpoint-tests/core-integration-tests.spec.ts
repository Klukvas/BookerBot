import supertest from "supertest";
import App from "../../../utils/core/server";
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
  
  it("Duraition-Seat-Date", async () => {
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
    await sendUserResponseToBot({request, expectedTextList: expectedStep4Response, userMessage: addDaysToCurrentDay()})

    await step5ApproveReservation({request})
  });
  it("Duraition-Date-Seat", async () => {
    await step1StartNewReservation({request})
    
    await step3ChooseDurationCommand({request})
    const expectedStep3Response = [
      step3Responses.success,
      nextStepMessages.pickDate,
      nextStepMessages.pickSeat
    ]
    await sendUserResponseToBot({request, expectedTextList: expectedStep3Response, userMessage: "2:00"})

    await step4ChooseDateCommand({request})
    const expectedStep4Response = [
      step4Responses.success,
      nextStepMessages.pickSeat,
    ]
    await sendUserResponseToBot({request, expectedTextList: expectedStep4Response, userMessage: addDaysToCurrentDay()})

    await step2ChooseSeatCommand({request, seats})
    const expectedStep2Response = [
      step2Responses.success,
      nextStepMessages.noStepsLeft,
    ]
    await sendUserResponseToBot({request, expectedTextList: expectedStep2Response, userMessage: seats[0].name})

    

    await step5ApproveReservation({request})
  });
  it("Seat-Duraition-Date", async () => {
    await step1StartNewReservation({request})
    
    await step2ChooseSeatCommand({request, seats})
    const expectedStep2Response = [
      step2Responses.success,
      nextStepMessages.pickDate,
      nextStepMessages.pickDuration,
    ]
    await sendUserResponseToBot({request, expectedTextList: expectedStep2Response, userMessage: seats[0].name})

    await step3ChooseDurationCommand({request})
    const expectedStep3Response = [
      step3Responses.success,
      nextStepMessages.pickDate,
    ]
    await sendUserResponseToBot({request, expectedTextList: expectedStep3Response, userMessage: "2:00"})

    await step4ChooseDateCommand({request})
    const expectedStep4Response = [
      step4Responses.success,
      nextStepMessages.noStepsLeft,
    ]
    await sendUserResponseToBot({request, expectedTextList: expectedStep4Response, userMessage: addDaysToCurrentDay()})

    await step5ApproveReservation({request})
  });
  it("Seat-Duraition-Date", async () => {
    await step1StartNewReservation({request})
    
    await step2ChooseSeatCommand({request, seats})
    const expectedStep2Response = [
      step2Responses.success,
      nextStepMessages.pickDate,
      nextStepMessages.pickDuration,
    ]
    await sendUserResponseToBot({request, expectedTextList: expectedStep2Response, userMessage: seats[0].name})

    await step3ChooseDurationCommand({request})
    const expectedStep3Response = [
      step3Responses.success,
      nextStepMessages.pickDate,
    ]
    await sendUserResponseToBot({request, expectedTextList: expectedStep3Response, userMessage: "2:00"})

    await step4ChooseDateCommand({request})
    const expectedStep4Response = [
      step4Responses.success,
      nextStepMessages.noStepsLeft,
    ]
    await sendUserResponseToBot({request, expectedTextList: expectedStep4Response, userMessage: addDaysToCurrentDay()})

    await step5ApproveReservation({request})
  });
  it("Seat-Date-Duraition", async () => {
    await step1StartNewReservation({request})
    
    await step2ChooseSeatCommand({request, seats})
    const expectedStep2Response = [
      step2Responses.success,
      nextStepMessages.pickDate,
      nextStepMessages.pickDuration,
    ]
    await sendUserResponseToBot({request, expectedTextList: expectedStep2Response, userMessage: seats[0].name})

    await step4ChooseDateCommand({request})
    const expectedStep4Response = [
      step4Responses.success,
      nextStepMessages.pickDuration,
    ]
    await sendUserResponseToBot({request, expectedTextList: expectedStep4Response, userMessage: addDaysToCurrentDay()})

    await step3ChooseDurationCommand({request})
    const expectedStep3Response = [
      step3Responses.success,
      nextStepMessages.noStepsLeft,
    ]
    await sendUserResponseToBot({request, expectedTextList: expectedStep3Response, userMessage: "2:00"})

    await step5ApproveReservation({request})
  });
  it("Date-Seat-Duraition", async () => {
    await step1StartNewReservation({request})
    
    await step4ChooseDateCommand({request})
    const expectedStep4Response = [
      step4Responses.success,
      nextStepMessages.pickDuration,
      nextStepMessages.pickSeat
    ]
    await sendUserResponseToBot({request, expectedTextList: expectedStep4Response, userMessage: addDaysToCurrentDay()})

    await step2ChooseSeatCommand({request, seats})
    const expectedStep2Response = [
      step2Responses.success,
      nextStepMessages.pickDuration
    ]
    await sendUserResponseToBot({request, expectedTextList: expectedStep2Response, userMessage: seats[0].name})

    await step3ChooseDurationCommand({request})
    const expectedStep3Response = [
      step3Responses.success,
      nextStepMessages.noStepsLeft
    ]
    await sendUserResponseToBot({request, expectedTextList: expectedStep3Response, userMessage: "2:00"})

    await step5ApproveReservation({request})
  });
  it("Date-Duraition-Seat", async () => {
    await step1StartNewReservation({request})
    
    await step4ChooseDateCommand({request})
    const expectedStep4Response = [
      step4Responses.success,
      nextStepMessages.pickDuration,
      nextStepMessages.pickSeat
    ]
    await sendUserResponseToBot({request, expectedTextList: expectedStep4Response, userMessage: addDaysToCurrentDay()})

    await step3ChooseDurationCommand({request})
    const expectedStep3Response = [
      step3Responses.success,
      nextStepMessages.pickSeat
    ]
    await sendUserResponseToBot({request, expectedTextList: expectedStep3Response, userMessage: "2:00"})

    await step2ChooseSeatCommand({request, seats})
    const expectedStep2Response = [
      step2Responses.success,
      nextStepMessages.noStepsLeft
    ]
    await sendUserResponseToBot({request, expectedTextList: expectedStep2Response, userMessage: seats[0].name})

    await step5ApproveReservation({request})
  });

});