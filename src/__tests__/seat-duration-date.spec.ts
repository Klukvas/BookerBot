import mongoose from "mongoose";
import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import App from "../utils/core/server";
import { generateTelegramMessage } from "./core/generate-telegram-message";

const app = new App().app;
const request = supertest(app);

describe('API Tests', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should return "Hello, World!"', async () => {
    const resp = await request
      .post('/new-message')
      .send(generateTelegramMessage())
      .timeout(9000) 
      .expect(200);
    console.log(resp);
  });

  // Add more tests as needed
});
