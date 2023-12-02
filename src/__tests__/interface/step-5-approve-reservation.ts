import { responseMessages } from "../../utils/response-messages"
import { generateTelegramMessage } from "../core/generate-telegram-message"
import { sendRequestToBot } from "../infra/send-request-to-bot"
import { TestRequest } from "../types/request"


export async function step5ApproveReservation({request}: TestRequest) {
  const message = generateTelegramMessage({messageText: "/approve-reservation"})
  const response = await sendRequestToBot({request, message})
  expect(response.text).toBe(responseMessages.reservationFinished)
}