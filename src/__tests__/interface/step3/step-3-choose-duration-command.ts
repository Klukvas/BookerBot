import { responseMessages, step3Responses } from "../../../utils/response-messages"
import { generateTelegramMessage } from "../../core/generate-telegram-message"
import { TestRequest } from "../../types/request"
import { sendRequestToBot } from "../../infra/send-request-to-bot"

export async function step3ChooseDurationCommand(args: TestRequest) {
  const {request} = args
  const message = generateTelegramMessage({messageText: "/chooseDuration"})
  const {response, repliedMessage} = await sendRequestToBot({request, message})
  expect(repliedMessage).toBe(step3Responses.successCommand)
  expect(response.statusCode).toBe(200)
}