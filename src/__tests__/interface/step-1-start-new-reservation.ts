import { step1Responses } from "../../utils/response-messages"

import { sendRequestToBot } from "../infra/send-request-to-bot"
import { TestRequest } from "../types/request"

export async function step1StartNewReservation(args: TestRequest) {
  const {request} = args
  const {response, repliedMessage} = await sendRequestToBot({request})
  expect(repliedMessage).toBe(step1Responses.success)
  expect(response.statusCode).toBe(200)
}