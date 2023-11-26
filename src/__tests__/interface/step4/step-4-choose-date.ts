import moment from "moment"
import { generateTelegramMessage } from "../../core/generate-telegram-message"
import { TestRequest } from "../../types/request"
import { sendRequestToBot } from "../../infra/send-request-to-bot"

type Step4ChooseDateArgs = {
  date?: string
} & TestRequest

const generateDate = () => {
  const today = moment();
  const tomorrow = today.clone().add(1, 'day');
  const tomorrowWithTime = tomorrow.clone().set({ hour: 12, minute: 30 }).format('DD.MM.YYYY HH:mm')
  return tomorrowWithTime.toString()
}

export async function step4ChooseDate(args: Step4ChooseDateArgs) {
  const {
    date = generateDate(), 
    request
  } = args
  const message = generateTelegramMessage({messageText: date})
  const response = await sendRequestToBot({request, message: message})
  expect(response.text).toContain('Замечательно! Время установлено. Осталось лишь подтвердить вашу резервацию. Для этого используйте команду /approve-reservation')
  
}