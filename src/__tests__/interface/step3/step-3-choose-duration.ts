import { generateTelegramMessage } from "../../core/generate-telegram-message"
import { TestRequest } from "../../types/request"
import { sendRequestToBot } from "../../infra/send-request-to-bot"

type ExpectedList = {
  expectedText?: never;
  expectedTextList: string[];
};

type ExpectedText = {
  expectedText: string;
  expectedTextList?: never;
};

type step3ChooseDurationArgs = {
  duration?: string;
} & TestRequest & (ExpectedList | ExpectedText);


export async function step3ChooseDuration(args: step3ChooseDurationArgs) {
  const {request, duration = '2:00', expectedTextList, expectedText} = args
  const message = generateTelegramMessage({messageText: duration})
  const {response, repliedMessage} = await sendRequestToBot({request, message: message})
  
  if(expectedText){
    expect(repliedMessage?.trim()).toBe(expectedText)
  }else{
    for(const item of expectedTextList!){
      expect(repliedMessage).toContain(item)
    }
  }
  
  expect(response.statusCode).toBe(200)
}