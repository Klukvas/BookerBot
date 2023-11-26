import { generateTelegramMessage } from "../../core/generate-telegram-message"
import { sendRequestToBot } from "../../infra/send-request-to-bot"
import { ISeat } from "../../../models"
import { TestRequest } from "../../types/request"

type Step2ChooseSeatCommandArgs = {
  seats: ISeat[]
} & TestRequest

export async function step2ChooseSeatCommand(args: Step2ChooseSeatCommandArgs) {
  const {request, seats} = args
  // step 2 - /choose-seat
  const step2Message = generateTelegramMessage({messageText: "/choose-seat"})
  const step2Response = await sendRequestToBot({request, message: step2Message})
  expect(step2Response.text).toContain('Отлично! Давайте выберем место. Вот список всех мест:')
  for(const seat of seats){
    expect(step2Response.text).toContain(seat.name)
  }
    
}