import { generateTelegramMessage } from "../../core/generate-telegram-message"
import { TestRequest } from "../../types/request"
import { sendRequestToBot } from "../../infra/send-request-to-bot"


type step3ChooseDurationArgs = {
  text?: string
} & TestRequest

export async function step3ChooseDuration(args: step3ChooseDurationArgs) {
  const {request, text = '2:00'} = args
  const message = generateTelegramMessage({messageText: text})
  const response = await sendRequestToBot({request, message: message})
  expect(response.text.trim()).toBe('Отлично! Продолжительность выбрана. Вы можете выбрать желаемую дату используя команду /choose-date')
}