import mongoose from "mongoose";
import supertest from "supertest";
import app from "../src/app_old";
import { generateTelegramMessage } from "./core/generate-telegram-message";
import * as db from './core/db'

require("dotenv").config();
const request = supertest(app);


describe('API Tests', () => {
  it('should return "Hello, World!"', (done) => {
    request
      .post('/new-message')
      .send('/help')
      .expect(200)
  });

  // Add more tests as needed
});
