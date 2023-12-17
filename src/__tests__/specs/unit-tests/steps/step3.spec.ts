import { ISeat, ReservedSeats } from "../../../../models"
import { step3 } from "../../../../views/steps/step3";
import { Message } from "../../../../types/new-message";
import { IUser, User } from "../../../../models/user";
import { Response } from "express";
import App from "../../../../core/server";
import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import moment from "moment-timezone";
import { sendResponse } from "../../../../utils/send-response";
import { json } from "body-parser";
import { step3Responses } from "../../../../utils/response-messages";

// moment.tz.setDefault('Europe/Kiev');

jest.mock("../../../../utils/send-response")

describe('Step 3 tests', () => {
  let user: IUser;
  let mongod: MongoMemoryServer;


  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri)
  })

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase()
    user = await User.create({
      userId: 2203942,
      chatId: 12387123312442
    })
  })

  afterAll(async () => {
    await mongoose.connection.destroy()
    await mongod.stop()
  })

  test('Reserved to cross with close time', async () => {
    // tommorow 19:30
    const tomorrow = moment().add(1, 'days').set({ hour: 19, minute: 30, second: 0, millisecond: 0 });
    const reservation = await ReservedSeats.create({
      reservedFrom: tomorrow,
      user: user._id
    })
    const message = {
      text: "6:00",
      chat:{
        id: 123123
      }
    }
    await step3({
      message: message as Message,
      user,
      res: (null as unknown) as Response,
      currentReservation: reservation
    })

    const A2MockInstance = sendResponse as jest.Mock;
    const calls = A2MockInstance.mock.calls;
    console.log(JSON.stringify(calls))
    expect(calls[0][0].message).toContain(step3Responses.tooCloseToCloseTime)

  })
})