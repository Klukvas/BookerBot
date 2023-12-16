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
  const postMessage = generateTelegramMessage({messageText: "/chooseSeat"})
  const {response, repliedMessage} = await sendRequestToBot({request, message: postMessage})
  expect(repliedMessage).toContain('Отлично! Давайте выберем место. Вот список всех мест:')
  for(const seat of seats){
    expect(repliedMessage).toContain(seat.seatNumber)
  }
  expect(response.statusCode).toBe(200)
    
}