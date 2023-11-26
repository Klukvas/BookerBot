import { generateTelegramMessage } from "../../core/generate-telegram-message"
import { sendRequestToBot } from "../../infra/send-request-to-bot"
import { ISeat } from "../../../models"
import { TestRequest } from "../../types/request"

type Step2ChooseSeatArgs = {
  seats: ISeat[]
} & TestRequest


export async function step2ChooseSeat(args: Step2ChooseSeatArgs) {
  const {seats, request} = args
  //step 2 - send choosed seat
  const step2Message2 = generateTelegramMessage({messageText: seats[0].name})
  const step2Response2 = await sendRequestToBot({request, message: step2Message2})
  console.log('step2Response2: ', step2Response2)
  const expectedMessage = 'Супер, вы выбрали место!\n' +
  'Вы можете выбрать желаемую дату используя команду /choose-date\n' +
  'Вы можете выбрать продолжительность резервации используя команду /choose-duration\n'
  expect(step2Response2.text).toBe(expectedMessage)

    
}