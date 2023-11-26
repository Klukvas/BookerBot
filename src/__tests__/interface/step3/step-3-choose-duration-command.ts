import { responseMessages } from "../../../utils/response-messages"
import { generateTelegramMessage } from "../../core/generate-telegram-message"
import { TestRequest } from "../../types/request"
import { sendRequestToBot } from "../../infra/send-request-to-bot"

export async function step3ChooseDurationCommand(args: TestRequest) {
  const {request} = args
  const step3Message = generateTelegramMessage({messageText: "/choose-duration"})
  const step3Response = await sendRequestToBot({request, message: step3Message})
  expect(step3Response.text).toBe(responseMessages.selectDuration)
}