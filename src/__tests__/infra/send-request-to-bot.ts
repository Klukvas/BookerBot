import supertest, { Response } from "supertest";
import { TelegramUpdate } from "../../types/new-message";
import { generateTelegramMessage } from "../core/generate-telegram-message";
import { TestRequest } from "../types/request";
import sendResponseMock from "../__mocks__/send-response.mock";

type SendRequestToBotArgs = {
    message?: TelegramUpdate
    request:  supertest.SuperTest<supertest.Test>
}

type SendRequestToBotResult = {
  response: Response
  repliedMessage: string | null
}

export async function sendRequestToBot(args: SendRequestToBotArgs): Promise<SendRequestToBotResult>{
  const {request, message = generateTelegramMessage()} = args
  sendResponseMock.setupMock()
  const url = '/new-message'
  const response = await request
      .post(url)
      .send(message)
  const repliedMessage = sendResponseMock.message
  return {response, repliedMessage}
}