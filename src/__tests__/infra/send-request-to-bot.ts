import { Response } from "supertest";
import { TelegramUpdate } from "../../types/new-message";
import { generateTelegramMessage } from "../core/generate-telegram-message";
import { TestRequest } from "../types/request";

type SendRequestToBotArgs = {
    message?: TelegramUpdate
} & TestRequest

export async function sendRequestToBot(args: SendRequestToBotArgs): Promise<Response>{
  const {request, message = generateTelegramMessage()} = args
  const url = '/new-message'
  const response = await request
      .post(url)
      .send(message)
  return response
}