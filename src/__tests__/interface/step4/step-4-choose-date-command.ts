import { responseMessages } from "../../../utils/response-messages"
import { generateTelegramMessage } from "../../core/generate-telegram-message"
import { sendRequestToBot } from "../../infra/send-request-to-bot"
import { TestRequest } from "../../types/request"

export async function step4ChooseDateCommand(args: TestRequest) {
  const {request} = args
  const message = generateTelegramMessage({messageText: "/choose-date"})
  const response = await sendRequestToBot({request, message: message})
  expect(response.text).toBe(responseMessages.selectDate)
}