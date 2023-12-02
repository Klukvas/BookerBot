import { step1Responses } from "../../utils/response-messages"
import sendResponseMock, { SendResponseMock } from "../__mocks__/send-response.mock"

import { sendRequestToBot } from "../infra/send-request-to-bot"
import { TestRequest } from "../types/request"

export async function step1StartNewReservation(args: TestRequest) {
  const {request} = args
  sendResponseMock.setupMock()
  await sendRequestToBot({request})
  const mess = sendResponseMock.message
  console.log(mess)
  expect(mess).toBe(step1Responses.success)
}