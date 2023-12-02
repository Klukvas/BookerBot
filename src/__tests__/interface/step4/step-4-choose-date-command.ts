import { responseMessages, step4Responses } from "../../../utils/response-messages"
import { generateTelegramMessage } from "../../core/generate-telegram-message"
import { sendRequestToBot } from "../../infra/send-request-to-bot"
import { TestRequest } from "../../types/request"

export async function step4ChooseDateCommand(args: TestRequest) {
  const {request} = args
  const message = generateTelegramMessage({messageText: "/chooseDate"})
  const {response, repliedMessage} = await sendRequestToBot({request, message: message})
  expect(repliedMessage).toBe(step4Responses.successCommand)
  expect(response.statusCode).toBe(200)
}