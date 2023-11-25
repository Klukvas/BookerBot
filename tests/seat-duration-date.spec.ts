import mongoose from "mongoose";
import supertest from "supertest";
import app from "../src/app";
import { generateTelegramMessage } from "./core/generate-telegram-message";
import * as db from './core/db'

require("dotenv").config();
const request = supertest(app);




describe('Test by following steps: seat-duration-date', () => {
  beforeAll(async () => {
    await db.connect()
  });
  afterEach(async () => {
    await db.clearDatabase()
  });
  afterAll(async () => {
    await db.closeDatabase()
  });

  it('Positive', async () => {
    const response = await request
      .post('/new-message')
      .send(generateTelegramMessage())
    console.log(response.body)
  })
})