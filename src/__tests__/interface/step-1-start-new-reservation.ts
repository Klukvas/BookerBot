import { responseMessages } from "../../utils/response-messages"
import { sendRequestToBot } from "../infra/send-request-to-bot"
import { TestRequest } from "../types/request"

export async function step1StartNewReservation(args: TestRequest) {
  const {request} = args
  const step1Response = await sendRequestToBot({request})
  expect(step1Response.text).toBe(responseMessages.createReservationStep1)
}